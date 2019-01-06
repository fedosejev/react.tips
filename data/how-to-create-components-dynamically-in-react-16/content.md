# How To Create Components Dynamically in React 16

One of them most common tasks that we need to know how to do with React is to render a list of items _dynamically_ - meaning: we don't know how many items we're going to render at any given time. Zero or one hundred - it shouldn't matter.

Let's learn how to do it with a help of an intuitive example.

In this tutorial, we're going to build this application:

<figure class="figure">
  <a href="https://fedosejev.github.io/how-to-create-components-dynamically-in-react-16/" target="_blank">
    <img src="./images/app.png" alt="Application screenshot" class="figure-img img-fluid img-rounded" />
  </a>
  <figcaption class="figure-caption">Figure 1. Our application.</figcaption>
</figure>

You can find the full source code in <a href="https://github.com/fedosejev/how-to-create-components-dynamically-in-react-16">this GitHub repository</a>.

Our application is going to render 5 images _dynamically_. There is a catch: our application will work equally well for 50 or any other number of images. Let's see how.

Our application will be made of 2 React components:

1. `App`
2. `Image`

The `App` component is a root component - it encapsulates our entire React application. `Image` component on the other hand renders a single image element.

Let's create the `Image` component first:

<figure class="figure">
<pre>
<code class="language-jsx">
import React from "react";

const Image = ({ source }) => (
  <img src={`./images/${source}`} alt="Example" className="w-25 m-2" />
);

export default Image;
</code>
</pre>
<figcaption class="figure-caption">Code snippet 1. Image.js</figcaption>
</figure>

As you can see our functional `Image` component renders:

<figure class="figure">
<pre>
<code class="language-jsx">
<img src={`./images/${source}`} alt="Example" className="w-25 m-2" />
</code>
</pre>
<figcaption class="figure-caption">Code snippet 2. Image.js</figcaption>
</figure>

`img` DOM element will be rendered when you create an instance of `Image` React component.

We get an image source from the parent React component as a `source` property:

<figure class="figure">
<pre>
<code class="language-jsx">
src={`./images/${source}`}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 3. Image.js</figcaption>
</figure>

Now that we have a way to render more than one image - how can we render more than one?

That's a job for our `App` component. Let's create it:

<figure class="figure">
<pre>
<code class="language-jsx">
import React from "react";
import Image from "./Image";

const IMAGES = [
  "IMG_5774.jpg",
  "IMG_6305.jpg",
  "IMG_6701.jpg",
  "IMG_6732.jpg",
  "IMG_6795.jpg"
];

const App = () => (
  <div className="container">
    <div className="row mt-2 mb-2">
      <div className="col-sm-12 text-center">

        {IMAGES.map(image => (
          <Image source={image} key={image} />
        ))}

      </div>
    </div>
  </div>
);

export default App;
</code>
</pre>
<figcaption class="figure-caption">Code snippet 4. App.js</figcaption>
</figure>

First we declare `IMAGES` array with five image filenames:

<figure class="figure">
<pre>
<code class="language-js">
const IMAGES = [
  "IMG_5774.jpg",
  "IMG_6305.jpg",
  "IMG_6701.jpg",
  "IMG_6732.jpg",
  "IMG_6795.jpg"
];
</code>
</pre>
<figcaption class="figure-caption">Code snippet 5. App.js</figcaption>
</figure>

Then we declara our `App` component that renders some layout elements with [Bootstrap](http://getbootstrap.com/) class names and then iterates over `IMAGES` array creating new `Image` component instance for each image:

<figure class="figure">
<pre>
<code class="language-jsx">
{IMAGES.map(image => (
  <Image source={image} key={image} />
))}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 6. App.js</figcaption>
</figure>

The `Image` component gets two props: the `source` and the `key` props. Remember that our `Image` component needs to know what image file it should render and `source` property tells it exactly that. But what about that `key` property - we don't use it in our `Image` component - why are we passing it then?

The `key` property is [used by React to uniquely identify](https://reactjs.org/docs/lists-and-keys.html) our `Image` component instances.

Think about it this way: React needs a way to distinguish between multiple instances of a child component (our `Image` component is a child component of `App` component) when they're created _dynamically_.

Naturally, the value for `key` property must be unique. It's up to us where this value is coming from. In this example, all file names are unique, so we're using them as unique keys for dynamic children.

## Let's review

Here is what's happening: in our `App` component React calls `render` function that iterates over `IMAGES` array and creates a new `Image` component instance for each `image` in the `IMAGES` array.

If we later decide to update `IMAGES` array and add another 10 image - our React application will work without any changes. That's the power of dynamically generating child components in React.

And that's how you create components dynamically in React 16.

Thank you for your attention!

Please take a look at [the complete source code on GitHub](https://github.com/fedosejev/how-to-create-components-dynamically-in-react-16) and [the live version](https://fedosejev.github.io/how-to-create-components-dynamically-in-react-16/) of our app.

I hope you've enjoyed this tutorial and I would love to hear your feedback in the comments. You can get in touch with me via [Twitter](http://twitter.com/artemy) and [email](mailto:artemij@fedosejev.com).

<img src="../__static/images/artemij-fedosejev.jpg" alt="Artemij Fedosejev" class="author-photo clip-shape" />

[Artemij Fedosejev](http://artemij.com)