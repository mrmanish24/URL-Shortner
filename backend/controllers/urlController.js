import shortid from "shortid";
import URL from "../model/url.js";

export async function handlePostUrl(req,res){
    const body = req.body;
    const userId = req.user._id;
    if (!body){
        return res.status(400).json({
            message : "URL not found, Please Provide URL"
        })
    }
    // create short id

    let shortId;
    if (!body.shortUrlRoute || body.shortUrlRoute.trim() === "") {
      shortId = shortid();
    } else {
      shortId = body.shortUrlRoute.trim();
    }


    try {
      const checkUrlPresent = await URL.findOne({ shortId: shortId });

      if (checkUrlPresent) {
        return res.status(400).json({
          message: "Custom URL already exists, please choose another",
        });
      }

      const newUrlData = await URL.create({
        shortId: shortId,
        redirectUrl: `https://${body.url}`,
        vistedHistory: [],
        createdBy: userId,
      });

      res.status(200).json({
        message: "shortID successfullly created",
        shortId: newUrlData.shortId,
      });
    } catch (error) {
      console.log("Error while creating URL:", error);
      return res.status(500).json({
        message: "Server error while creating URL",
      });
    }
}

export async function handleRedirectUrl(req,res){
    console.log("redirecting route triggered")
    const shortId = req.params.shortId;
    if(!shortId){
      console.log("shortid missing");
      res.status(400).json({
        message : "short url missing"
      })
    }
    try {
        const entry = await URL.findOneAndUpdate({
            shortId
        },{
            $push : {
                visitedHistory : {
                    timestamp : Date.now()
                }
            }
        });

        if (!entry){
            return res.status(404).json({message: "short URL not found"});
        }
        console.log("redirected");
      return res.redirect(entry.redirectUrl)
    } catch (error) {
      console.log("bad request")
       return res.status(500).json({
          message: "error in redirection",
        });
    }
}

export async function getAnalytics(req, res) {
  try {
    console.log("getAnalytics");

    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "not authorized" });
    }

    // REAL DATA
    const linksArr = await URL.find({ createdBy: userId }).lean();

    console.log("Clean Data:", linksArr);
    return res.json({
      success: true,
      data: linksArr,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ message: "server error" });
  }
}
