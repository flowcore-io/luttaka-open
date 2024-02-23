import EventTransformer from "@/lib/event-transformer"
import {
  ProfileArchivedEventPayload,
  ProfileCreatedEventPayload,
  profileEvent,
  ProfileUpdatedEventPayload
} from "@/contracts/events/profile";
import {eq} from "drizzle-orm";
import {db} from "@/database";
import {profiles} from "@/database/schemas";

const eventTransformer = new EventTransformer(profileEvent, {
  created: async (payload: unknown) => {
    const data = ProfileCreatedEventPayload.parse(payload);

    const existingProfile = await db.query.profiles.findFirst(
      {where: eq(profiles.userId, data.userId)}
    );

    if (existingProfile) {
      const result = await db.update(profiles).set({
        userId: data.userId, // todo: evaluate if this is a good idea
        firstName: data.firstName,
        lastName: data.lastName,
        title: data.title,
        description: data.description,
        socials: data.socials,
        company: data.company,
        avatarUrl: data.avatarUrl
      }).where(eq(profiles.id, data.id));

      if (result.rowCount > 0) {
        console.warn(`Profile ${data.id} already existed, updated instead`);
      }
      return;
    }

    const result = await db.insert(profiles).values({
      id: data.id,
      userId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      description: data.description,
      socials: data.socials,
      company: data.company,
      avatarUrl: data.avatarUrl
    });

    if (result.rowCount > 0) {
      console.log(`Created profile ${data.id}}`);
    }
  },
  updated: async (payload: unknown) => {
    const data = ProfileUpdatedEventPayload.parse(payload);

    const existingProfile = await db.query.profiles.findFirst(
      {where: eq(profiles.id, data.id)}
    );

    if (!existingProfile) {
      console.error(`Could not update profile ${data.id}, because profile was not found`);
      return;
    }

    const result = await db.update(profiles).set({
      firstName: data.firstName,
      lastName: data.lastName,
      title: data.title,
      description: data.description,
      socials: data.socials,
      company: data.company,
      avatarUrl: data.avatarUrl
    }).where(eq(profiles.id, data.id));

    if (result.rowCount > 0) {
      console.log(`Updated profile ${data.id}}`);
    }
  },
  archived: async (payload: unknown) => {
    const data = ProfileArchivedEventPayload.parse(payload);

    const existingProfile = await db.query.profiles.findFirst(
      {where: eq(profiles.id, data.id)}
    );

    if (!existingProfile) {
      console.error(`Could not archive profile ${data.id}, because profile was not found`);
      return;
    }

    await db.update(profiles).set({
      archived: true,
      reason: data.reason
    }).where(eq(profiles.id, data.id));
  }
})


export const POST = eventTransformer.post.bind(eventTransformer)
