import {api} from "@/trpc/server";
import {UserProfileForm} from "@/components/organisms/profile/user-profile-form";
import {UserProfile} from "@/components/organisms/profile/user-profile";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default async function MyUserRedirectPage() {

  const user = await api.user.me.query();

  return (
    <div className={"md:flex w-[100%] md:space-x-10"}>
      <div className={"flex-1"}>
        <UserProfileForm
          user={user}
        />
      </div>
      <Card className={"flex-2 mt-8 md:mt-0"}>
        <CardHeader>
          <div className={"flex justify-between"}>
            <h1 className={"text-2xl font-bold"}>Your Profile</h1>
            <Link className={""} href={`/users/${user.userId}`}>
              <Button>Visit</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className={"px-3"}>
          <UserProfile user={user}/>
        </CardContent>
      </Card>

    </div>
  );
}