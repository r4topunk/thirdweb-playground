import Link from "next/link";
import { Button } from "./button";

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <Button asChild variant="outline">
      <Link href={href} target="_blank" aria-label={label}>
        {icon}
      </Link>
    </Button>
  );
}
