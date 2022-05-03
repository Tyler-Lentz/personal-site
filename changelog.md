# Tyler Lentz, A16366194
# CSE134B Homework 5 Website Changelog

Important Note: When running lighthouse on every page of my app, I got the following error: "There may be stored data affecting loading performance in this location: IndexedDB. Audit this page in an incognito window to prevent those resources from affecting your scores." I attempted to run the lighthouse in an incognito window like it said, but that did not remove the error. I also tried to wipe all of my site data in the application tab of Chrome Dev Tools, but this did also not fix it. I don't know how much this messed up the results, but absolutely could not get this message to go away. I still got recommendations for improvements in the report, but I'm just not sure how accurate these numbers are. I am including this information to be as transparent as possible.

## Before Scores

Performance / Accessibility / Best Practices / SEO

- Home Page: 99 / 100 / 100 / 100
- Contact Page: 100 / 100 / 100 / 100
- About Me Page: 88 / 100 / 93 / 100
- Projects Page: 98 / 100 / 100 / 90

## Improvements

- Contact Page: Implemented the contact form so that it stores the contact information in the database and is viewable in the firebase console.
- Contact Page: Added noscript tag to tell the user that javascript is required to use the contact form.
- About Me Page: Fixed incorrect aspect ratios for a lot of images
- Projects Page: Made link text for personal projects download/github links more descriptive ("Here" -> "Download") so that the search engine understands better understands what the link is for. 
- Projects Page: Fixed incorrect aspect ratios for some images.

## After Scores

Performance / Accessibility / Best Practices / SEO

- Home Page: 100 / 100 / 100 / 100
- Contact Page: 100 / 100 / 100 / 100
- About Me Page: 93 / 100 / 100 / 100
- Projects Page: 100 / 100 / 100 / 100