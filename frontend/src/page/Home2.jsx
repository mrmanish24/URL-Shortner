import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UrlForm from "@/mycomponents/UrlForm";

const Home2 = ({
  badge = "✨ Make Your URLs Sexy Again",
  heading = "Shrink Your Links. Grow Your Impact.",
  description = "A lightning-fast, privacy-focused link shortener. Custom routes, instant redirects, zero complexity",

  buttons = {
    primary: { text: "Shorten My Link", url: "/" },

    secondary: { text: "Try a Demo Link", url: "/" },
  },
}) => {
  return (
    <div>
      <section className="py-32 border h-screen max-h-screen">
        <div className="flex justify-center items-center">
          <div className="container">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                {badge && (
                  <Badge variant="outline">
                    {badge}
                    <ArrowUpRight className="ml-2 size-4" />
                  </Badge>
                )}
                <h1 className="my-6 dark:text-white text-pretty text-4xl font-bold lg:text-6xl">
                  {heading}
                </h1>
                <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
                  {description}
                </p>
                <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                  {buttons.primary && (
                    <Button asChild className="w-full sm:w-auto">
                      <a href={buttons.primary.url}>{buttons.primary.text}</a>
                    </Button>
                  )}
                  {buttons.secondary && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full sm:w-auto dark:text-muted-foreground"
                    >
                      <a href={buttons.secondary.url}>
                        {buttons.secondary.text}
                        <ArrowRight className="size-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <UrlForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home2;
