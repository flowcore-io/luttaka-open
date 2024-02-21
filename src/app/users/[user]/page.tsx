import {api} from "@/trpc/server";
import {UserProfileView} from "@/components/organisms/profile/user-profile-view";
import {type WithUrlParams} from "@/lib/next-app.types";

export type UserProfileProps = {
  user: string;
}

export default async function User({params}: WithUrlParams<UserProfileProps>) {

  const user = await api.user.get.query({
    userId: params.user
  });

  return (
    <div>
      <UserProfileView
        user={user}
      />
    </div>
  );
}
