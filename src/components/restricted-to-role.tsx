import {type UserRole} from "@/contracts/user/user-role";
import {type FC, type PropsWithChildren} from "react";
import {api} from "@/trpc/react";

export type RestrictedToRoleProps = {
  role: UserRole;
}

/**
 * React component that restricts the rendering of its children based on the user's role.
 * @component
 * @example
 * // Usage:
 * <RestrictedToRole role={"admin"}>
 *   <p>I am an admin</p>
 * </RestrictedToRole>
 */
export const RestrictedToRole: FC<PropsWithChildren<RestrictedToRoleProps>> = (props) => {

  const userRole = api.authorization.role.useQuery();

  if (!userRole.data) {
    return null;
  }

  if (userRole.data !== props.role) {
    return null;
  }

  return props.children;
}
