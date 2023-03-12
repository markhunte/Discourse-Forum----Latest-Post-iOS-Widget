// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;

/*
 
//==== FUNCTION LOGIC
 
•  req.loadJSON() =>  json data
 
• IF runsInWidget
 
 ->  smallWidgets(), otherWidgets()... determined by args if small, medium, large widget in use
 
        -> parseDetails()..parse post details from jason..
            -> jPoster().. returns latest posts list
            -> jImage().. returns latest post user image url
            convert().. cleans post title
 
        ->timeToString ... converts post date
            -> diff_minutes(),diff_hours() -> returns relative time string
          
        ->iurl  .. returns image data
  
/*

 NOTE on first_Entry_starting_At constant.
 
 //==
 
 Skipping the first entry :   We normally include the first entry but we want to hide if it is a sticky post 
 i.e "About the Scriptable category" 

 var removeFirstEntry  = false/true
 
==//

• ELSE
  // MAKE TABLE FOR SHEET//
     -> parseDetails().parse post details from jason..
        -> jPoster().. returns latest posts list
        -> jImage().. returns latest post user image url
        convert().. cleans post title
    ->timeToString ... converts post date
        -> diff_minutes(),diff_hours() -> returns relative time string
   
    ->iurl  .. returns image data
•IF (config.runsWithSiri)
 
 Speak
 show table
 
 //=
 
 There are two json trees in use from the json data.
 Users and topic_list
 The users id is in the topic list along with most of the other needed data.
 The user id is then searched for in the users tree to find the users image.
*///===============================

///===
//Debugging within Scriptable
var debugWidget = false
var debugSize = "large"
///====


const forumURL = "https://talk.automators.fm"
const url = forumURL+"/c/scriptable/13.json"

const widget_forum_heading = "Scriptable"  // Name of Forum

var removeFirstEntry = true
 
const req = new Request(url)
const json = await req.loadJSON()
const  imageSize = 42
var widgetPostLimit = 6
const lineColor = Color.white()
const lineOpacity=  0.2
const lineHeight = 0.5

// Panel colours
const widgetBG =   new Color("#1C4560")
const widgetTitleColor = new Color("#CCCCCC", 1)


const widgetTextColor  = Color.yellow() 
const userNameTextColor = Color.white()

//-- user groups
const jUsers = json.users

//-- latest topic groups
var  jTopics = json.topic_list.topics
 
 
 if (removeFirstEntry){
  
  jTopics.shift();
  
 }

const tablePostLimit = jTopics.length

var listWidge = new ListWidget()

listWidge.backgroundColor =  widgetBG
// new Color("#3D3A3A",1) //
var forumHeader = listWidge.addStack()
forumHeader.layoutHorizontally()
var forumHD = forumHeader.addText(widget_forum_heading)
forumHD.font = Font.semiboldRoundedSystemFont(15)
forumHeader.topAlignContent()
forumHD.textColor = widgetTitleColor
forumHeader.url = forumURL


///=====---------DEBUGGER
        

if (debugWidget){
        
            if( debugSize =="small" ) {
           
         var { listWidge, jPosters, postDetails, pTime, imurl, iurl, imgz ,widgetPostLimit} = await smallWidgets()
         
         listWidge.presentSmall()
        } else if( debugSize == "medium" ){
             widgetPostLimit = 3 
             
             var { listWidge, jPosters, postDetails, pTime, imurl, iurl, imgz,widgetPostLimit } = await otherWidgets()
        
        
        listWidge.presentMedium()
     
        } else if( debugSize == "large" ){
         var { listWidge, jPosters, postDetails, pTime, imurl, iurl, imgz,widgetPostLimit } = await otherWidgets()
         
       listWidge.presentLarge()
     }

        return
    }
 
///=====---------debugger end

 if (config.runsInWidget) {
     
    // create and show widget dependant on size chosen
       if (config.widgetFamily == "small"){
          
         var { listWidge, jPosters, postDetails, pTime, imurl, iurl, imgz ,widgetPostLimit} = await smallWidgets()
          
       
     } else  if (config.widgetFamily == "medium") {
             
         //-- limit post number
         
         widgetPostLimit = 3
              
              var { listWidge, jPosters, postDetails, pTime, imurl, iurl, imgz,widgetPostLimit } = await otherWidgets()
        
     } else if (config.widgetFamily == "large"){
         
         //-- use default widgetPostLimit
          var { listWidge, jPosters, postDetails, pTime, imurl, iurl, imgz,widgetPostLimit } = await otherWidgets()
       } else if (config.widgetFamily == "extraLarge"){
         
        
                 //-- use default widgetPostLimit
          var { listWidge, jPosters, postDetails, pTime, imurl, iurl, imgz,widgetPostLimit } = await otherWidgets()
       }
   
    //
   
    

Script.setWidget(listWidge)
  
  Script.complete()
                           
                           
                           
} else {
   
    // MAKE TABLE FOR SHEET
  
    let table = new UITable()
    
    // add header
    let row = new UITableRow()
    row.isHeader = true
    row.addText(widget_forum_heading)
    table.addRow(row)
    
  
    let posts = json.latest_posts
    
   
   for (i = 0; i < tablePostLimit; i++) {
        var jPosters =  jTopics[i]
        //-- retrieve last poster details from topic post item
        var postDetails = await parseDetails(jPosters)
        
             //-- retrieve last post time details from topic post item
        var pTime = timeToString( postDetails.timeOfPost)
        
        let row = new UITableRow()
        let thisSlug = postDetails.URLSlug
        row.onSelect = (idx) => {
            let item = jPosters[idx]
            
            Safari.open(thisSlug)
        }
        //--RETRIEVE & BUILD USER/POSTER DETAILS
        var imurl = postDetails["avatarImage"]
        var iurl = new Request(imurl)
        var imgz = await iurl.loadImage();
        
        //console.log(postDetails.posterUName)
        let title = postDetails.postTitle.toString()

       
        let subtitle = postDetails.posterUName  + "    " + pTime.toString()
    
        let imageCell = row.addImageAtURL(imurl)
        let titleCell = row.addText(title, subtitle)
        imageCell.widthWeight = 20
        titleCell.widthWeight = 80
        row.height = 80
        row.cellSpacing = 10
        table.addRow(row)
}

  
  
//
  if (config.runsWithSiri)
      Speech.speak(`. Here are The latest Posts`)
    
  table.present()
   
}
 

//=====
 //--Helpers
//-- Get Latest poster avatar image
function jImage(latestPosterImageID){
    for(var ii = 0; ii < jUsers.length; ii++){
        
        var thisID = jUsers[ii].id
        
        
        if(thisID === latestPosterImageID) {
          
            return jUsers[ii].avatar_template;
        }
    }
}
//- Parse HRS Time  for posts
function diff_hours(dt2, dt1)
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(diff);
  
 }
 //- Parse MINS Time  for posts
 function diff_minutes(dt2, dt1)
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
  
 }


 //- Time of posts
function timeToString(dat1)
{
    
    var dt1 =new Date( dat1)
  var dt2 = new Date()
    
     var dif = diff_hours(dt1, dt2)
 
var pTime = ""
if (dif > 23.59) {

dif =  (diff_hours(dt1, dt2) /24).toString()

pTime = Math.round(dif) + "D"
} else if (dif < 0.99) {

var dif = diff_minutes(dt2, dt1)

pTime =  dif   + "m"

}else {

pTime = Math.round(dif)  + "h"

}
        
 return "     " + pTime;
 
}

 
//-- Get Latest poster id
        
function jPoster(jPosters){
    
    
    for(var ii = 0; ii < jPosters.length; ii++){
        
        var thisLatest = jPosters[ii].extras
        
        
        if(thisLatest != null && thisLatest.includes('latest')) {
            return  jPosters[ii].user_id
        }
    }
    
}

        //--PARSE POSTER DETAILS
        function parseDetails(jPosters){


                  var item = jPosters.fancy_title
                var posterName = jPosters.last_poster_username
                var itemID = jPosters.id
                var itemPostCount = jPosters.posts_count  
                
                var itemTitleUrlSlug =   (forumURL + "/t/" + jPosters.slug + "/" + itemID  + "/" + itemPostCount).toString()
                var fancyTitle = item.toString()
                var timePosted = (jPosters.last_posted_at).toString()
                var latestPosterImageID =  jPoster(jPosters.posters)
 
        //-- May throw an ERROR if a poster has not chosen an avatar image yet., SO we try catch and use a Blog image as substitute.
                try {
                  
                  
                  
                    var userImage = jImage(latestPosterImageID).toString()
                           
                        
                  
                       var imageURL = userImage.replace('{size}', 50);
                   
                 
                 if (imageURL.indexOf('http')!=0) {
                    imageURL = forumURL+imageURL
                 }
                
                
                 
                    
                }
                catch(err) {
                 
                    var imageURL = "https://talk.automators.fm/uploads/default/original/1X/826af977e952a1707e9634545216ae15b6e9ed0e.jpg"
                    
                }
                
               
                
            var itemTitleUrlSlug =   (forumURL + "/t/" + jPosters.slug + "/" + itemID  + "/" + itemPostCount).toString()
            var fancyTitle = convert(  item.toString());
        
    function convert(str)
    {
      str = str.replace( /&amp;/g, "\&");
      str = str.replace(/&gt;/g,"\>" );
      str = str.replace(/&lt;/g, "<");
      str = str.replace( /&quot;/g, "\"");
      str = str.replace(/&#039;/g,/'/);
      str = str.replace(/&lsquo;/g,"\'");
      str = str.replace(/&rsquo;/g,"\'");
      str = str.replace(/&ldquo;/g,"\'");
      str = str.replace(/&rdquo;/g,"\'");
      return str;
    }
  

        var theResults = {URLSlug: itemTitleUrlSlug,avatarImage:imageURL,postTitle : fancyTitle ,posterUName:posterName,timeOfPost:timePosted}

        return theResults

        }
        
       

async function smallWidgets() {
  
    
    forumHeader.setPadding(0, 2, 0, 0)
    listWidge.addSpacer(5)

    //-- topic list item
    var jPosters = jTopics[0]  
    //-- retrieve last poster details from topic post item
    var postDetails = await parseDetails(jPosters)

    //-- retrieve last post time details from topic post item
    var pTime = timeToString(postDetails.timeOfPost)


    //--RETRIEVE & BUILD USER/POSTER DETAILS
    var imurl = postDetails["avatarImage"]
    var iurl = new Request(imurl)
    var imgz = await iurl.loadImage()
 
    //-- create first stack container
    var topStack = listWidge.addStack()

    // topStack.cornerRadius = 10
    topStack.layoutHorizontally()


    topStack.topAlignContent()
   
    //-- create image stack container inside top stack
    var imageStack = topStack.addStack()
    imageStack.centerAlignContent()
    imageStack.cornerRadius = 10


    //-- add the image
    var wimg = imageStack.addImage(imgz)
   
    wimg.imageSize = new Size(imageSize, imageSize)

    topStack.addSpacer(4)// move to right side a bit

    //-- add poster name & time for post
    var lowerGroupStack = topStack.addStack()
    lowerGroupStack.layoutVertically()

    var nameStack = lowerGroupStack.addStack()

    var timeStack = lowerGroupStack.addStack()

    lowerGroupStack.addSpacer(4)

    var userName = nameStack.addText(postDetails.posterUName)

    userName.font = Font.semiboldRoundedSystemFont(15)
    userName.textColor = userNameTextColor

    var times = timeStack.addText(pTime)
    times.font = Font.semiboldRoundedSystemFont(12)

    times.textColor = new Color("#AEFFFF", 1)


 
    ////
    listWidge.addSpacer(5)

    //-- create topic title stack  below
    var topicTitleStack = listWidge.addStack()
    //topicTitleStack.backgroundColor = new Color("#1c1c1e")
    topicTitleStack.centerAlignContent()

    //-- add the text
    var wtext1 = topicTitleStack.addText(postDetails.postTitle)

    wtext1.font = Font.semiboldRoundedSystemFont(16)
    wtext1.textColor = widgetTextColor



    //
    //-- add link url to all stacks/ not sure which one user will click.
    topStack.url = postDetails.URLSlug
    imageStack.url = postDetails.URLSlug
    topicTitleStack.url = postDetails.URLSlug
    listWidge.url = postDetails.URLSlug
    lowerGroupStack.url = postDetails.URLSlug
    lowerGroupStack.setPadding(0, 0, 0, 0)
    return { listWidge, jPosters, postDetails, pTime, imurl, iurl, imgz }
}

async function otherWidgets() {
  
   
    listWidge.setPadding(4, 4, 4, 4)
   
    //====--- set up BLOG Heading
    
    const forumHeaderSize = new Size(100, 1)//
    const forumHeaderContext = new DrawContext()
    forumHeaderContext.size = forumHeaderSize
     
    forumHeaderContext.respectScreenScale = true
    
    forumHeaderContext.setFillColor(Color.black())
    forumHeaderContext.fillRect(new Rect(0,0,forumHeaderSize.width,forumHeaderSize.height))//canvas bg black, Otherwise canvase will show behind as white
    forumHeaderContext.setFillColor(Color.yellow())

    forumHeaderContext.fillRect(new Rect(30,0.5,forumHeaderSize.width/3,0.5))
 
     
    const forumHeaderImage = forumHeaderContext.getImage()
    var forumStack =  listWidge.addStack()
    let forumBarImg = forumStack.addImage( forumHeaderImage)

    forumBarImg.centerAlignImage()
    forumBarImg.imageOpacity = lineOpacity
    forumHeader.setPadding(2, 115, 0, 100)
  //====
    
   for (i = 0; i < widgetPostLimit; i++) {
       if (i != 0){
        
     //====--- Draw lines between each post // each post only gets a line above, not bottom( will not put line at top or bottom of widget)
           const size = new Size(200, 1)//
        const hcontext = new DrawContext()
        
        
        hcontext.size = size
        hcontext.respectScreenScale = true

        hcontext.setFillColor(Color.yellow())

        hcontext.fillRect(new Rect(0,0,size.width,0.5))
          
        hcontext.setFillColor(Color.black())

        hcontext.fillRect(new Rect(0,0.5,size.width,0.5))//using as spacer
 
        const img = hcontext.getImage()
        var hStack =  listWidge.addStack()
       
        let hBarImg = hStack.addImage( img)
        hBarImg.imageOpacity = lineOpacity
 
    }


        //-- topic list item
        var jPosters = jTopics[i]

        //-- retrieve last poster details from topic post item
        var postDetails = await parseDetails(jPosters)

        //-- retrieve last post time details from topic post item
        var pTime = timeToString(postDetails.timeOfPost)


        //--RETRIEVE & BUILD USER/POSTER DETAILS
        var imurl = postDetails["avatarImage"]
        var iurl = new Request(imurl)
        var imgz = await iurl.loadImage()
 
        //-- create first stack container
        var topStack = listWidge.addStack()
        topStack.cornerRadius = 10
        topStack.layoutHorizontally()
        topStack.size.height = 100
        topStack.topAlignContent()
        
        //-- create image stack container inside top stack
        var imageStack = topStack.addStack()
        imageStack.centerAlignContent()

        imageStack.cornerRadius =  imageSize / 2


        //-- add the image
        var wimg = imageStack.addImage(imgz)
        wimg.leftAlignImage()
        wimg.imageSize = new Size(imageSize, imageSize)
        

        //-- create topic title stack container inside top stack
        var topicTitleStack = topStack.addStack()
 
        topicTitleStack.centerAlignContent()
        topicTitleStack.setPadding(0, 4, 0, 0)
        topicTitleStack.width = 250
        topicTitleStack.layoutVertically()

        //-- add the text
        var wtext1 = topicTitleStack.addText(postDetails.postTitle)

        wtext1.font = Font.semiboldRoundedSystemFont(16)
        wtext1.textColor = widgetTextColor
        topStack.addSpacer()
        listWidge.addSpacer(3)

        //-- add link url to all stacks/ not sure which one user will click.
        topStack.url = postDetails.URLSlug
        imageStack.url = postDetails.URLSlug
 
        topicTitleStack.url = postDetails.URLSlug

        //-- add poster name  and time for post
        var lowerGroupStack = topicTitleStack.addStack()
        lowerGroupStack.layoutHorizontally()
       
        var nameStack = lowerGroupStack.addStack()

        var timeStack = lowerGroupStack.addStack()


        nameStack.bottomAlignContent()
        timeStack.bottomAlignContent()

        var userName = nameStack.addText(postDetails.posterUName)
        //.setPadding(top, leading, bottom, trailing)
        userName.font = Font.semiboldRoundedSystemFont(12)
        userName.textColor = userNameTextColor

        timeStack.setPadding(1, 10, 0, 120)
        var times = nameStack.addText(pTime)
        times.font = Font.semiboldRoundedSystemFont(12)

        times.textColor = new Color("#AEFFFF", 1)
        
       
        
    }
    return { listWidge, jPosters, postDetails, pTime, imurl, iurl, imgz }

    
}