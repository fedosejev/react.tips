# Fragments in React 16

Imagine your React app needs to render a list of items, for example:

<figure class="figure">
<pre>
<code class="language-jsx">
<ul>
  <li>Private Item 1</li>
  <li>Private Item 2</li>
  <li>Private Item 3</li>
  <li>Public Item 1</li>
  <li>Public Item 2</li>
  <li>Public Item 3</li>
<ul>
</code>
</pre>
<figcaption class="figure-caption">Code snippet 1.</figcaption>
</figure>

In this list you have two types of items: private and public. They are grouped together and rendered by different React components. Private items are rendered by `PrivateListItems` React component and public items by `PublicListItems` React component.

The problem is that both `PrivateListItems` and `PublicListItems` components need to return multiple elements, for example:

<figure class="figure">
<pre>
<code class="language-jsx">
const PrivateListItems = () => (
  <li className="list-group-item">Private Item 1</li>
  <li className="list-group-item">Private Item 2</li>
  <li className="list-group-item">Private Item 3</li>
);
</code>
</pre>
<figcaption class="figure-caption">Code snippet 2. Anti-pattern.</figcaption>
</figure>

Unfortunately, this is not possible in React 16.

The rule is: a `render()` method in a React component must return only one element, not three `li` elements. We could wrap all three `li` elements in one parent element and return that element instead, but this will break our `ul` list.

So the question is: how can React component render three `li` elements without rendering a parent element?

This is what <a href="https://reactjs.org/docs/fragments.html" target="_blank">fragments</a> in React are for. Let's demonstrate how to use fragments with the help of a simple React application:

<figure class="figure">
  <a href="https://fedosejev.github.io/fragments-in-react-16/" target="_blank">
    <img src="./images/app.png" alt="Application screenshot" class="figure-img img-fluid img-rounded" />
  </a>
  <figcaption class="figure-caption">Figure 1. Our application.</figcaption>
</figure>

You can find the full source code in <a href="https://github.com/fedosejev/fragments-in-react-16">this GitHub repository</a>.

Our application is going to render a list of items. This list will be made of private and public items. Private items will be rendered by `PrivateListItems` component and public items will be rendered by `PublicListItems` component.

Our application will be made of [three React components](https://github.com/fedosejev/fragments-in-react-16/tree/master/src/components):

1. `App`
2. `PrivateListItems`
3. `PublicListItems`

`App` component is a container component - it encapsulates our entire React application, and renders `PrivateListItems` and `PublicListItems` as child components.

Let's create our `App` component first:

<figure class="figure">
<pre>
<code class="language-jsx">
import React from "react";
import PrivateListItems from "./PrivateListItems";
import PublicListItems from "./PublicListItems";

const App = props => (
  <div class="container">
    <div class="row">
      <div class="col-sm mt-5">
        <ul class="list-group">
          {props.userHasPermissions && <PrivateListItems />}
          <PublicListItems />
        </ul>
      </div>
    </div>
  </div>
);

export default App;
</code>
</pre>
<figcaption class="figure-caption">Code snippet 3. App.js</figcaption>
</figure>

Our `App` component renders three `div` elements with class names that you might recognize if you're familiar with [Bootstrap](http://getbootstrap.com). Bootstrap helps us create layout for our page.

Now let's focus on the `ul` element:

<figure class="figure">
<pre>
<code class="language-jsx">
<ul class="list-group">
  {props.userHasPermissions && <PrivateListItems />}
  <PublicListItems />
</ul>
</code>
</pre>
<figcaption class="figure-caption">Code snippet 4. App.js</figcaption>
</figure>

The `ul` element has two child components: `<PrivateListItems />` and `<PublicListItems />`.

As we've discussed earlier, our `ul` list is made of public and private `li` elements. We have two separate React components responsible for rendering those items:
+ `<PrivateListItems />` renders only private items.
+ `<PublicListItems />` renders only public items.

Why do we want to separate those items into different React components? Imagine a scenario where all users can see public items, but only user with additional permissions can see private items. For example, only authenticated users can see items that are private to them.

Notice that use `props.userHasPermissions` prop and <a href="https://reactjs.org/docs/conditional-rendering.html" target="_blank">logical operator `&&`</a> to decide if we want to render `<PrivateListItems />` component:

<figure class="figure">
<pre>
<code class="language-jsx">
{props.userHasPermissions && <PrivateListItems />}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 5. App.js</figcaption>
</figure>

The `userHasPermissions` is a prop with a boolean value. When the value is `true` our `App` component will render `<PrivateListItems />` component as a child. When the value is `false` our `App` component will not render `<PrivateListItems />` component.

Now when we render our `App` component we can pass `userHasPermissions` prop to it only when the user is authenticated, for example:

<figure class="figure">
<pre>
<code class="language-jsx">
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

ReactDOM.render(<App userHasPermissions />, document.getElementById("root"));
</code>
</pre>
<figcaption class="figure-caption">Code snippet 5. index.js</figcaption>
</figure>

Change `userHasPermissions` to `userHasPermissions={false}` and our `App` component will only render `PublicListItems` component.

<figure class="figure">
<pre>
<code class="language-jsx">
ReactDOM.render(<App userHasPermissions={false} />, document.getElementById("root"));
</code>
</pre>
<figcaption class="figure-caption">Code snippet 6. index.js</figcaption>
</figure>

Now let's take a look at our `PrivateListItems` component:

<figure class="figure">
<pre>
<code class="language-jsx">
import React, { Fragment } from "react";

const PrivateListItems = () => (
  <Fragment>
    <li className="list-group-item">Private Item 1</li>
    <li className="list-group-item">Private Item 2</li>
    <li className="list-group-item">Private Item 3</li>
  </Fragment>
);

export default PrivateListItems;
</code>
</pre>
<figcaption class="figure-caption">Code snippet 7. PrivateListItems.js</figcaption>
</figure>

It returns `Fragment` that wraps our three `li` items. What will `Fragment` type render into the DOM? Nothing! And that's exactly what we want our `PrivateListItems` component to do: render only three `li` items, without rendering a parent element.

You can think of a `Fragment` type as an element that is invisible to the DOM.

Now let's create our `PublicListItems` component:

<figure class="figure">
<pre>
<code class="language-jsx">
import React from "react";

const PublicListItems = () => (
  <>
    <li className="list-group-item">Public Item 1</li>
    <li className="list-group-item">Public Item 2</li>
    <li className="list-group-item">Public Item 3</li>
  </>
);

export default PublicListItems;
</code>
</pre>
<figcaption class="figure-caption">Code snippet 8. PublicListItems.js</figcaption>
</figure>

Wait, do we have a typo there? No, we don't! The empty tags `<>` and `</>` is a short syntax for declaring `Fragment` in React 16.

In other words, this:

<figure class="figure">
<pre>
<code class="language-jsx">
<>
  <li className="list-group-item">Public Item 1</li>
  <li className="list-group-item">Public Item 2</li>
  <li className="list-group-item">Public Item 3</li>
</>
</code>
</pre>
<figcaption class="figure-caption">Code snippet 9. PublicListItems.js</figcaption>
</figure>

Is the shorter version of this:

<figure class="figure">
<pre>
<code class="language-jsx">
<Fragment>
  <li className="list-group-item">Public Item 1</li>
  <li className="list-group-item">Public Item 2</li>
  <li className="list-group-item">Public Item 3</li>
</Fragment>
</code>
</pre>
<figcaption class="figure-caption">Code snippet 10. PublicListItems.js</figcaption>
</figure>

What's the difference between those two syntaxes if the result is the same? There is a difference. `<Fragment>` syntax supports a `key` attribute, while `<>` syntax - doesn't.

Now you know how to use fragments in React 16!

Thank you for reading this React tutorial.

Please take a look at [the complete source code on GitHub](https://github.com/fedosejev/fragments-in-react-16) and [the live version](https://fedosejev.github.io/fragments-in-react-16/) of our app.

I hope you've enjoyed this tutorial and I would love to hear your feedback in the comments. You can get in touch with me via [Twitter](http://twitter.com/artemy) and [email](mailto:artemij@fedosejev.com).

<img src="../__static/images/artemij-fedosejev.jpg" alt="Artemij Fedosejev" class="author-photo clip-shape" />

[Artemij Fedosejev](http://artemij.com)
