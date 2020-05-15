# Function Parameters In JavaScript

When you write a function that accepts a single parameters, you can write it like this:

<figure class="figure">
<pre>
<code class="language-jsx">
function transformData(data) {}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 1</figcaption>
</figure>

As you can see `transformData` accepts a single `data` parameter. This code is easy to write, read and use.

When you want to use `transformData` function later in your code, all you do is:

<figure class="figure">
<pre>
<code class="language-jsx">
const data = [];

transformData(data);
</code>
</pre>
<figcaption class="figure-caption">Code snippet 2</figcaption>
</figure>

But what if `transformData` need to accept two or more parameters?

How could you write such function?

<figure class="figure">
<pre>
<code class="language-jsx">
function transformData(data, filter, sort) {}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 3</figcaption>
</figure>

Now your function accepts three parameters: `data`, `filter` and `sort`. Such function is still easy to write and read, but what about using it?

<figure class="figure">
<pre>
<code class="language-jsx">
const data = [];

transformData(data, true, false);
</code>
</pre>
<figcaption class="figure-caption">Code snippet 4</figcaption>
</figure>

And here you'll discover a problem. When you write `transformData(data, true, false)`, you need to remember or look up the order of parameters, because if you write them on a different order, for example: `transformData(data, false, true)` - you will get an unexpected result from `transformData` function.

The problem is that the way the function accepts those three parameters creates an opportunity to introduce a bug by those who will use this function.

Right now `transformData` function expects three parameters in a certain order and if you make a mistake in your order, you will create a bug.

And what if one of the parameters is optional? The users of your function might start writing code like this:

<figure class="figure">
<pre>
<code class="language-jsx">
const data = [];

transformData(data, _, false);
</code>
</pre>
<figcaption class="figure-caption">Code snippet 5</figcaption>
</figure>

The `_` here communicates the fact that you don't want to provide the second parameter, but you have to mention it anyway in order to provide the third parameter, all because the order of parameters is important.

When you write a function you want to make sure that it will be very easy to use your function and hard to introduce a bug by using your function.

Let's rewrite `transformData` function. It will still accept three parameters, but it will not require them to be provided in a certain order.

<figure class="figure">
<pre>
<code class="language-jsx">
function transformData({ data, filter, sort }) {}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 6</figcaption>
</figure>

You might not notice the difference between `function transformData(data, filter, sort) {}` and `function transformData({ data, filter, sort }) {}` straight away, but there's a significant difference between the two ways to define that function.

Instead of listing three parameters, in which case their order is important, we'll make our `transformData` function to accept only one parameter - an object, and then we'll destruct that object as function parameters.

Now the order of `data`, `filter`, `sort` doesn't matter. This:

<figure class="figure">
<pre>
<code class="language-jsx">
function transformData({ data, filter, sort }) {}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 7</figcaption>
</figure>

Works just as well as this:

<figure class="figure">
<pre>
<code class="language-jsx">
function transformData({ sort, filter, data }) {}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 8</figcaption>
</figure>

And how would you use this function?

Easy. Remember that now `transformData` accepts only one parameter that is an object that has three properties: `data`, `filter` and `sort`. In any order, because object properties in JavaScript have no order.

<figure class="figure">
<pre>
<code class="language-jsx">
const data = [];

transformData({ data: data, filter: false, sort: true });
</code>
</pre>
<figcaption class="figure-caption">Code snippet 9</figcaption>
</figure>

Later if you decide to expand the functionality of `transformData` function, you will simply add another property to the single parameters object.

What do you think?