# Discorse Forum latest Post iOS Widget



 A widget created  with Scriptable.app for iOS to display: 

  <img src="README.assets/Screenshot 2020-11-04 at 17.10.40.jpg"   /> **Tumult Hype**  [<span style="color:darkgrey"><b>Forums</b> </span>](https://forums.tumult.com)  Latest posts 



|                           Small                           |                         Medium                          |                           Large                           |
| :-------------------------------------------------------: | :-----------------------------------------------------: | :-------------------------------------------------------: |
| <img src="README.assets/smallW1.png" style="zoom:50%;" /> | <img src="README.assets/medW1.png" style="zoom:50%;" /> | <img src="README.assets/largeW1.png" style="zoom:50%;" /> |



This  widget  ( ***ForumMHWidgetv1.js*** ) was created with [Scriptable](https://scriptable.app ) and is designed to show the latests user posts on the Tumult Hype Forum Site.

The Forum is powered by <img src="README.assets/Screenshot 2020-11-04.jpg" style="zoom:50%;" /> Which also powers many other forums.

It should be relatively easy to adapt to other [Discourse](https://www.discourse.org) powered fora, like the <img src="README.assets/Screenshot 2020-11-04 at 17.10.23.jpg" />   [Forums ](https://talk.automators.fm) which hosts a **Scriptable** category and where I spents some time threading through the posts. ( check it out)



Note  though, that the json files and their corresponding tree structure  and name keys may differer on other Discourse powered sites.

 <img src="README.assets/small.png" alt="small" style="zoom:50%;" /> ***Scriptable*** is a free app on the AppStore that allows you to write and automate using Javascript on your iOS devices. 



<hr>

#### Setup on iOS Device



The scriptable js file needs to be added to you scriptable list. You can simple drop the file into your iCloud' Drive's ***Scriptable*** folder on your Mac or via files.app on your device.



|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| <img src="README.assets/Screenshot 2020-11-04 at 17.08.45.jpg" style="zoom:50%;" /> | <img src="README.assets/IMG_2280.PNG" alt="IMG_2280" style="zoom:33%;" /> |



Once the files is on your device (should sync via iCloud from device to device)

Select a Scriptable Widget on your devices (iOS 14+)  Using the Add new widget on the Home Screen.

Choose the new Script file (ForumMHWidgetv1.js)  ~~and  in the **Parameter** field; enter either **small**, **medium** or **large**, depending on which size widget you have chosen.~~

The size of the widget will determine the type of display.

***Small*** will display a single latest post, ***Medium*** the top three latest posts and the ***Large*** will display the top six.



|                                                              |                                                              |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| <img src="README.assets/IMG_2277.PNG" alt="IMG_2277" style="zoom:33%;" /> | <img src="README.assets/IMG_2279_.PNG" alt="IMG_2279" style="zoom:33%;" /> |

 Hit **done**. Thats it.

Dont worry about changing the 'When interacting' that is overridden in the script.

<hr>

#### Usage

**From the widget.**

Each post when touched, will take you to the post entry in the thread.

The Tumult header when touched will take you to the Tumult main page and topic list.

Remember widgets do not show fully dynamic data. They are snapshots and update periodically 



**From  shortcuts , scriptable etc..**

Scriptable files can also be run from iOS Shortcuts.app

There is a **Table**  view presentation (sheet ) mainly for when used this way.

The Table view for the posts, is in fact the original idea ( and inspiration for this widget ) of @MaxZieb, another user of the forums, who also introduced us to Scriptable at the same time.

I have partially updated the Table's code to use the current data.



------



*The code mostly has comments.*

There are two json trees in use from the json file data.

 **users** and **topic_list**

 The users **id** is in the **topic** list along with most of the other needed data, including post id and url

 The user id is then searched for in the **users** tree to find the users image.

|                    **topic_list**/topics                     |                          **users**                           |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="README.assets/Screenshot 2020-11-04 at 17.52.34.jpg" alt="Screenshot 2020-11-04 at 17.52.34" style="zoom:50%;" /> | <img src="README.assets/Screenshot 2020-11-04 at 17.51.07.jpg" alt="Screenshot 2020-11-04 at 17.51.07" style="zoom:60%;" /> |



 





