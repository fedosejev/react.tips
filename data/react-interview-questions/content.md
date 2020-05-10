# React Interview Questions

In this tutorial, I am going to describe an interview process for a front-end React developer.

This is the process that I would follow if I would be an interviewer. And this is the process that I would like to be part of as an interviewee.

Let's start with discussing what you must know as a front-end developer.

## What you must know as a front-end developer

When I interview front-end developers I evaluate two critical skills:
1. How do you solve problems
2. How do you solve front-end problems with front-end tools, such as JavaScript, React, Redux, etc

Software developers solve problems. That's the core value that they bring to the table. Front-end developers solve front-end problems with front-end tools. 

If a business uses React, then their interview process should answer two questions: 1) how well can you solve problems, and 2) how well can you solve front-end problems with React. Naturally, knowing React (and other front-end tools) well, will help you to solve front-end problems well.

In your preparation for a front-end React interview adapt this mindset: React is only a tool that solves a specific problem. Master the process of solving front-end problems with React and you'll master React as a tool.

In this tutorial, I'll give you an example of a coding test that has a specific problem, that can be solved with React.

Let's discuss the interview process first.

## The interview process

Personally, I prefer three stage interview process:
1. A phone call conversation about my previous experience
2. A coding test
3. A face-to-face conversation about my solution for the coding test

## Stage 1: Let's talk about your experience

First, I want to learn about your previous experience of solving problems as a front-end developer. I am interested in hearing what problems have you solved and how you solved them.

You can talk about the products or features you've built, the team that you were part of and the constraints that you had to deal with.

Talk about high level first. What were you building, who was on your team and what was the development process that you've followed.

Then give examples of specific problems and then solutions. Mention solutions that you found that worked and - that didn't work - and what lessons you've learned from them.

Then talk about what are you looking for in your next role: what products are interested in building, what problems would you like to solve and what technologies would you like to learn.

The goal of this conversation is to establish the baseline for expectations - what should I expect your skills level to be and what you should expect from a new role.

## Stage 2: Let's solve a problem

Now it's time to test your skills. I will ask you to solve a specific problem. This problem would be an example of a task that you would get if you would join the company that's hiring.

You can solve it at home or at your face-to-face interview as a pair programming exercise.

If you're asked to solve it at home, then the expectation is for you to spend less then a day on it. If you're asked to solve it at the face-to-face interview, then it could be from an hour to two hours pair programming exercise.

The goal of this test is to see your current skills in action, get a sense of what you know about different aspects of software development and create a context for our next interview stage where we'll discuss your solution and I'll ask you any follow up questions that I might have.

## Stage 3: Let's discuss how you solved a problem

I'll review your solution for the coding test and prepare follow-up questions. We might talk about why have you chosen one solution over the other, how do you think about system design and architecture, how different data-structures affect performance and how do you choose the right one.

At this stage I'll learn more about your broader understanding of how to build a better software.

## The coding test

In this coding test you'll need to build a shopping cart using React.

Shopping cart requirements:
1. Display the total number of items in the shopping cart.
2. Display the total price for all the items in the shopping cart.
3. Display `Clear shopping cart` button that removes all items from the shopping cart.
      1. If the shopping cart is empty, then the `Clear shopping cart` button is disabled.
4. Display a list of all items in the shopping cart and for each item:
      1. Display item name.
      2. Display item quantity.
      3. Display price for one unit of the item.
      4. Display total price for all units of the item.
      5. Display `Change quantity` button that displays quantity editing view.
      6. Display `Remove` button.
      7. When user clicks on `Change quantity` button, display quantity editing view:
         1. Display total price for all units of this item.
         2. Display editable input field with quantity value for the item.
         3. Display `Add one` button that adds one more item to the total quantity for the item.
         4. Display `Remove one` button that removes one item from the total quantity for the item.
            1. If quantity is `0`, then `Remove one` button is disabled.
         5. Display `Save` button that:
            1. Updates:
               1. Total quantity for the item.
               2. Total number of items for the entire shopping cart.
               3. Total price for the entire shopping cart.
            2. Hides quantity editing view.
         6. If no changes were made, then `Save` button is disabled.
         7. Display `Cancel` button that discards any changes and hides quantity editing view.
      8.  When user clicks on `Remove` button, then remove item from the shopping list and update:
         8. Total number of items for the entire shopping cart.
         9. Total price for the entire shopping cart.


[Here's a live example of the React app that you need to build](https://fedosejev.github.io/react-shopping-cart/). 

Before you continue reading this tutorial - try to do the coding test and build the app yourself first.

Take maximum time of one day.

Choose the code editor that works for you best. I recommend using [Visual Studio Code](https://code.visualstudio.com/).

This coding test will drive the follow-up questions that I'll ask you in the Stage 3 of the interview process.

## The solution for the coding test

If you would like to see my solution, then [here it is](https://github.com/fedosejev/react-shopping-cart).

## The follow-up questions

_Coming soon._

## General React questions

Often I'll ask questions that we didn't cover during the coding test part of the interview.

#### Question

How to improve React application performance?

#### Answer

The key approach is to reduce the number of component re-renders in your React application.

Practically, this can be achieved in a couple of different ways:
1. Using [React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent) instead of [React.Component](https://reactjs.org/docs/react-api.html#reactcomponent) base class.
2. Using [React.memo](https://reactjs.org/docs/react-api.html#reactmemo).
3. Decouple UI layer from data layer in your React application. Understand _why_ your React application is slow - find where in your application do you have code that takes significant time to run. Find out what part of your application is slow. It can be rendering React components, or transforming and calculating data. If you separate the UI layer - your React components from the data layer - your data transformation and calculation functions, then you can optimize their performance easier. For React components, consider using methods mentioned previously. For data transformation functions, consider using [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).
