Group 13

Matthew Tennant, Yize Zhao, Zhichun Zhang, Zhihe Yu

**Application**: Travel Packing List

**Overview**
Travel Packing List is a web based application for users to plan their packing list for a trip. The user is able to name their list, add a destination, and input their planned activities. The application has multiple views for easy planning of clothes for multiple days, activities, and the finalized composite packing list. 

**Why a Travel packing list?**
Packing for a trip can be overwhelming, especially when there are multiple activities during each day, multiple destinations, and varying weather conditions. Laying out what one will need by activity makes a lot more sense than one huge list, ignoring the actual use of each item. However, everyone needs a master list when it comes to actually packing bags. Our application aims to simplify the process, reducing stress and saving time for users by providing a structured, easy-to-use interface tailored to individual travel needs.

**Existing site - For Redesign**
The site https://packtor.com provides a web-based place to create a packing list for a trip. The site has some features we aim to keep, such as presetting the climate and offering suggested items to pack. However, the site has a poor UI design which we want to improve on. We want to use this site for its good qualities and learn from its mistakes, but our application will be a complete redesign and feel like a different tool. 

Key Improvements from Packtor:
  Set-up stage: The set-up stage to set travellers, destinate, trip length, list name, climate, accommodation (hotel/hostel), and travel type (holiday/backpacking) is currently in a separate view. The user can’t see the list, or how the application works at all until they specify these requirements. We want to put the setup stage in a toolbar so that the user can see the list as they set their requirements. 
Too many suggestions: The application offers so many suggestions for items to pack that the user is scrolling down a long time before having the opportunity to enter items themselves. 
  Site Organization: The application has multiple lists where the user scrolls for a long time and checks off (or manually adds) random individual items that they want to add to their list. There is no day-to-day view, ability to enter clothes for specific days, or ability to see what was already added to the list. We want to create a calendar-like view, where the user can enter their item into the slot they aim to use it, so that they can visualize the length of their trip, activities, and what they already packed while adding more items to the list. 
Default settings: The website didn’t allow customized default lists; our redesign would introduce personalized defaults you can save, edit, and access instantly, streamlining packing for every adventure. 

**Our Design - Key Features**
Name Your Packing List: Easily create and label packing lists for different trips.
Add Travel Details: Specify the destination, climate, duration, and planned activities for each trip.
Customized Default List(s): Users may want to confirm that their home water, electricity, and gas are safe before travelling, or they may have some necessities that they carry with them every time they travel. Users can customize some lists so that they don’t have to make the same additions every time they create a packing list. 
Two Flexible Views:
Day-by-Day View: Organize items by day and planned activities, like a calendar. 
Composite Packing List: A finalized summary of all items to be packed.
Interactive Packing Blocks:
Separate sections for each day and activity.
Users can input items for specific activities (e.g., flight, sightseeing, bedtime).

**Example User Workflow**
1) Initial setup:
Location: Florida
Length of trip: 2 days
Travellers packing for: 1 Woman
Climate: Warm

2) The user adds activities to the calendar:
Day 1
Flight 8am-10am
Brunch 11am-1pm
Disney 1:30pm-9pm
Bedtime 9pm-8am
Day 2
Breakfast 9am-10am
Disney 11am-3pm
Flight 4pm-6pm

3) The user adds items to pack to blocks on the calendar view:
Day 1:
Flight: T-shirt, shorts, etc.
Activity 1: T-shirt, shorts, etc.
Bedtime: Pajamas, etc.
Day 2:
Activity 2: Casual wear, etc.
Flight: Comfortable wear, etc.

4) The user navigates to the list view and adds more items:
Items that were added in the calendar view are seen in the list view
User adds: bathroom supplies, medication, chargers, etc.
5) Iteration between 4 and 5 continues until the user is satisfied with their list. 
6) On a separate screen, The user is able to create customized default list(s). This ensures user never forget essentials/To-dos before leaving home while adapting effortlessly to different trips or activities.
7) User saves their list(s) and can export, share, etc.. They have the option to do this at any time in the process, but in a typical workflow this would be at the end.

**User Interface Views - Rough Explanation**
Day-to-Day view example - extremely rough mockup made on my apple calendar to show what a calendar-based packing list may look like. There would be clickable options to add within each activity box.

Final list view - Takes elements from each activity and totals into one master list, with the ability to add more items and remove them at any time.  
2 T-shirts
1 bathing suit
4 shorts 
Etc.

