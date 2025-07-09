
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { Webhook } from 'svix';
import prisma from '@/lib/client';

export async function POST(req: Request) {

    // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400
        })
    }

    // Do something with the payload
    // For this guide, you simply log the payload to the console
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(`Webhook received with ID: ${id} and type: ${eventType}`);
    console.log('Full webhook data:', JSON.stringify(evt.data, null, 2));

    if (eventType === "user.created") {
        try {
            console.log('Creating user with data:', {
                id: evt.data.id,
                username: evt.data.username,
                avatar: evt.data.image_url || "/noAvatar.png",
                cover: "/noCover.png"
            });
            
            await prisma.user.create({
                data: {
                    id: evt.data.id,
                    username: evt.data.username || evt.data.email_addresses?.[0]?.email_address?.split('@')[0] || `user_${evt.data.id.slice(-8)}`,
                    avatar: evt.data.image_url || "/noAvatar.png",
                    cover: "/noCover.png"
                }
            })
            console.log('User created successfully');
            return new Response("User created", { status: 200 });
        } catch (err) {
            console.error('Error creating user:', err);
            return new Response('Error creating user', { status: 500 });
        }
    }

    if (eventType === "user.updated") {
        try {
            console.log('Updating user with data:', {
                id: evt.data.id,
                username: evt.data.username,
                avatar: evt.data.image_url || "/noAvatar.png"
            });
            
            await prisma.user.update({
                where:{
                    id: evt.data.id
                },
                data: {
                    username: evt.data.username || evt.data.email_addresses?.[0]?.email_address?.split('@')[0] || `user_${evt.data.id.slice(-8)}`,
                    avatar: evt.data.image_url || "/noAvatar.png"
                }
            })
            console.log('User updated successfully');
            return new Response("User updated", { status: 200 });
        } catch (err) {
            console.error('Error updating user:', err);
            return new Response('Error updating user', { status: 500 });
        }
    }

    return new Response("Webhook received", { status: 200 });
}