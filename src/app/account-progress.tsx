import {type FC, type ReactNode, useMemo} from "react";
import {CheckCircle, CircleDashed} from "lucide-react";

type AccountProgressProps = {
  active: boolean;
  done: boolean;
  title: string;
  inactiveIcon: ReactNode;
}

export const AccountProgress: FC<AccountProgressProps> = (props) => {

  const status = useMemo(() => {
    if (props.done) {
      return <CheckCircle className={"text-primary"}/>
    }

    if (!props.active) {
      return props.inactiveIcon;
    }

    if (props.active) {
      return <CircleDashed className={"animate-spin"}/>
    }
  }, [props.active, props.done, props.inactiveIcon]);

  const titlePostfix = useMemo(() => props.active ? "..." : "", [props.active]);

  return (
    <div className={"flex space-x-2 items-center"}>
      {status}
      <p className={props.active ? "animate-pulse" : ""}>
        {props.title}{titlePostfix}
      </p>
    </div>
  );
}
