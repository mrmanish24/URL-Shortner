import api from "@/apiintercepter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Analytics = () => {
  const [urls, setUrls] = useState([]);
  const server = import.meta.env.VITE_BACKEND_URL;
const fetchAnalytics = async () =>{
  console.log("fetching data")
  try {
    console.log("trying fetching data")
    const { data } = await api.get("/api/v2/url/analytics");
    console.log("data fetched")
    console.log(data)
    setUrls(data.data)
    console.log(data)
    toast.success("links are loaded")
  } catch (error) {
    console.log(error)
    toast.error("error in fetching data")
  }
}

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    // <div className="p-6 max-w-6xl mx-auto  h-screen">
    //   <div className="mt-16">
    //     {/* PAGE TITLE */}
    //     <h1 className="text-3xl font-bold mb-8 dark:text-accent-foreground ">
    //       Analytics Dashboard
    //     </h1>

    //     {/* TOP CARDS */}
    //     <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
    //       <Card>
    //         <CardHeader>
    //           <CardTitle>Total Links Created</CardTitle>
    //         </CardHeader>
    //         <CardContent className="text-3xl font-bold">
    //           {urls.length}
    //         </CardContent>
    //       </Card>

    //       <Card>
    //         <CardHeader>
    //           <CardTitle>Total Clicks</CardTitle>
    //         </CardHeader>
    //         <CardContent className="text-3xl font-bold">
    //           {urls.reduce((acc, curr) => acc + curr.visitedHistory.length, 0)}
    //         </CardContent>
    //       </Card>
    //       <Card>
    //         <CardHeader>
    //           <CardTitle>Most Clicked Link</CardTitle>
    //         </CardHeader>
    //         <CardContent className="text-xl overflow-x-auto">
    //           {urls.length === 0
    //             ? "—"
    //             : urls.reduce((max, link) =>
    //                 link.visitedHistory.length > max.visitedHistory.length
    //                   ? link
    //                   : max
    //               ).redirectUrl}
    //         </CardContent>
    //       </Card>
    //     </div>

    //     {/* TABLE */}
    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Your Links</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <table className="w-full table-auto border-collapse">
    //           <thead>
    //             <tr className="border-b text-left">
    //               <th className="p-2">Original URL</th>
    //               <th className="p-2">Short URL</th>
    //               <th className="p-2">Copy Link</th>
    //               <th className="p-2">Clicks</th>
    //               <th className="p-2">Last Visit</th>
    //             </tr>
    //           </thead>

    //           <tbody>
    //             {urls.map((item, index) => (
    //               <tr key={index} className="border-b hover:bg-accent">
    //                 <td className="p-2 max-w-[200px] truncate">
    //                   {item.redirectUrl}
    //                 </td>

    //                 <td className="p-2 text-primary ">
    //                   {server}/api/v2/url/{item.shortId}
    //                 </td>
    //                 <td className="p-2 font-semibold">
    //                   <Button
    //                     onClick={() => {
    //                       navigator.clipboard.writeText(
    //                         `${server}/api/v2/url/${item.shortId}`
    //                       );
    //                       toast.info("Link Copied");
    //                     }}
    //                   >
    //                     Copy
    //                   </Button>
    //                 </td>

    //                 <td className="p-2 font-semibold">
    //                   {item.visitedHistory.length}
    //                 </td>

    //                 <td className="p-2">
    //                   {item.visitedHistory.length > 0
    //                     ? new Date(
    //                         item.visitedHistory[
    //                           item.visitedHistory.length - 1
    //                         ].timestamp
    //                       ).toLocaleString()
    //                     : "No visits"}
    //                 </td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //       </CardContent>
    //     </Card>
    //   </div>
    // </div>
    <div className="p-4 sm:p-6 max-w-6xl mx-auto min-h-screen">
      <div className="mt-10 sm:mt-16">
        {/* PAGE TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 dark:text-accent-foreground">
          Analytics Dashboard
        </h1>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Links Created</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl sm:text-3xl font-bold">
              {urls.length}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Clicks</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl sm:text-3xl font-bold">
              {urls.reduce((acc, curr) => acc + curr.visitedHistory.length, 0)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Most Clicked Link</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto text-sm sm:text-lg font-medium break-all">
              {urls.length === 0
                ? "—"
                : urls.reduce((max, link) =>
                    link.visitedHistory.length > max.visitedHistory.length
                      ? link
                      : max
                  ).redirectUrl}
            </CardContent>
          </Card>
        </div>

        {/* TABLE */}
        <Card>
          <CardHeader>
            <CardTitle>Your Links</CardTitle>
          </CardHeader>

          {/* TABLE SCROLL WRAPPER FOR MOBILE */}
          <div className="overflow-x-auto">
            <CardContent className="min-w-[650px]">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="border-b text-left text-sm sm:text-base">
                    <th className="p-2">Original URL</th>
                    <th className="p-2">Short URL</th>
                    <th className="p-2">Copy</th>
                    <th className="p-2">Clicks</th>
                    <th className="p-2">Last Visit</th>
                  </tr>
                </thead>

                <tbody>
                  {urls.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-accent">
                      <td className="p-2 max-w-[200px] truncate">
                        {item.redirectUrl}
                      </td>

                      <td className="p-2 text-primary break-all text-sm sm:text-base">
                        {server}/api/v2/url/{item.shortId}
                      </td>

                      <td className="p-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `${server}/api/v2/url/${item.shortId}`
                            );
                            toast.info("Link Copied");
                          }}
                        >
                          Copy
                        </Button>
                      </td>

                      <td className="p-2 font-semibold">
                        {item.visitedHistory.length}
                      </td>

                      <td className="p-2 text-sm sm:text-base">
                        {item.visitedHistory.length > 0
                          ? new Date(
                              item.visitedHistory[
                                item.visitedHistory.length - 1
                              ].timestamp
                            ).toLocaleString()
                          : "No visits"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
