import {api} from "@/trpc/server";
import {UserProfileForm} from "@/components/organisms/profile/user-profile-form";
import {UserProfileView} from "@/components/organisms/profile/user-profile-view";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function MyUserRedirectPage() {

  const profile = await api.profile.me.query();

  return (
    <div className={"md:flex w-[100%] md:space-x-10"}>
      <div className={"flex-1"}>
        <UserProfileForm
          user={profile}
        />
      </div>
      <Card className={"flex-2 mt-8 md:mt-0"}>
        <CardHeader>
          <div className={"flex justify-between"}>
            <h1 className={"text-2xl font-bold"}>Your Profile</h1>
            <Link className={""} href={`/profiles/${profile.id}`}>
              <Button>Visit</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className={"px-3"}>
          <UserProfileView profile={profile}/>
        </CardContent>
      </Card>

    </div>
  );
}
