import {db} from "@/database";
import {getInitialsFromString} from "@/server/lib/format/get-initials-from-string";
import {type UserProfile} from "@/contracts/profile/user-profile";

export const getProfiles = async (): Promise<UserProfile[]> => {
  const profiles = await db.query.profiles.findMany({});
  if (!profiles.length) {
    return [];
  }

  return profiles.map((profile): UserProfile => {
    const displayName = `${profile.firstName} ${profile.lastName}`;
    const initials = getInitialsFromString(displayName);
    return {
      id: profile.id,
      userId: profile.userId,
      displayName: displayName,
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      title: profile.title ?? "",
      description: profile.description ?? "",
      socials: profile.socials ?? "",
      company: profile.company ?? "",
      avatarUrl: profile.avatarUrl ?? "",
      initials
    }
  });
}
