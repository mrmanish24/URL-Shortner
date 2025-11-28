import api from "@/apiintercepter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { urlSchema } from "@/config/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClosedCaption, CrosshairIcon, PanelBottomClose, X } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

const UrlForm = () => {
  const [showUrl, setShowUrl] = useState(false);
  const [shortId, setShortId] = useState(null);
  const methods = useForm({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      shortUrlRoute: "",
    },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/api/v2/url", data);
      toast.success("your url is shorted");
      setShortId(response.data.shortId)
      setShowUrl(true);
    } catch (error) {
      toast.error(error?.response?.error?.message);
    }
  };

  const handleCopy = () =>{
    const fullUrl =  `http://localhost:9034/api/v2/url/${shortId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.info("shorted link is Copied")
  }
  return (
    <div className="w-full mx-auto mt-10">
      {!showUrl && (
        <FormProvider {...methods}>
          <Card className="shadow-md">
            <CardHeader>
              <h2 className="text-xl font-semibold">Shorten Your URL</h2>
              <CardDescription>
                Paste your long link and instantly generate a short, shareable
                URL.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent>
                <FieldSet>
                  <FieldGroup>
                    {/* URL INPUT */}
                    <Field>
                      <FieldLabel htmlFor="url">Enter your long URL</FieldLabel>
                      <Input
                        id="url"
                        type="text"
                        placeholder="e.g. google.com/search"
                        {...register("url")}
                      />

                      <FieldDescription>
                        Avoid typing{" "}
                        <span className="font-semibold">http://</span> or{" "}
                        <span className="font-semibold">https://</span>. It will
                        be added automatically.
                      </FieldDescription>
                      <FieldError>{errors.url?.message}</FieldError>
                    </Field>

                    {/* SHORT ROUTE INPUT */}
                    <Field className="mt-4">
                      <FieldLabel htmlFor="shortUrlRoute">
                        Custom short link (optional)
                      </FieldLabel>
                      <Input
                        id="shortUrlRoute"
                        type="text"
                        placeholder="e.g. dashboard"
                        {...register("shortUrlRoute")}
                      />
                      <FieldDescription>
                        Create your own custom ending. Example result:
                        <span className="text-muted-foreground">
                          {" "}
                          yourdomain.com/
                        </span>
                        <span className="font-medium">dashboard</span>
                      </FieldDescription>
                      <FieldError>{errors.shortUrlRoute?.message}</FieldError>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </CardContent>

              <CardFooter className="flex justify-center mt-2">
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full"
                >
                  {isSubmitting ? "Processing..." : "Generate Short URL"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </FormProvider>
      )}

      {showUrl && (
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Your URL is Shorted</h2>
              <Button onClick={()=>setShowUrl(false)}>
                <X/>
              </Button>
            </div>
            <CardDescription>
              Copy your URL and use it anywhere.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full max-w-md flex-col gap-6">
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>Shorted URL</ItemTitle>
                  <ItemDescription>/{shortId}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button onClick={handleCopy} variant="outline" size="sm">
                    Copy Link
                  </Button>
                </ItemActions>
              </Item>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UrlForm;
