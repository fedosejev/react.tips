# Radio Buttons in React 16

How do you use radio buttons in React 16?

I agree, it can be confusing at first. Let me explain it to you with a help of a simple example.

Here is the application that we're going to build:

<figure class="figure">
  <a href="https://fedosejev.github.io/radio-buttons-in-react-16/" target="_blank">
    <img src="./images/app.png" alt="Application screenshot" class="figure-img img-fluid img-rounded" />
  </a>
  <figcaption class="figure-caption">Figure 1. Our application.</figcaption>
</figure>

You can find the full source code in <a href="https://github.com/fedosejev/radio-buttons-in-react-16/">this GitHub repository</a>.

We'll start by creating new React component called `App`:

<figure class="figure">
<pre>
<code class="language-jsx">
import React, { Component } from "react";

class App extends Component {
  render() {
    return ({/* JSX code */});
  }
}

export default App;
</code>
</pre>
<figcaption class="figure-caption">Code snippet 1.</figcaption>
</figure>

Our component doesn't render anything, yet.

What should it render? From Figure 1 you can clearly see the following 2 user interface elements:

1. Radio buttons
2. Save button

Let's start with creating radio button elements. In `render()` function we'll write JSX code that creates `<form>` element with 3 `<input>` elements nested inside:

<figure class="figure">
<pre>
<code class="language-jsx">
<div className="container">
  <div className="row mt-5">
    <div className="col-sm-12">

      <form>
        
        <div className="form-check">
          <label>
            <input
              type="radio"
              name="react-tips"
              value="option1"
              checked={true}
              className="form-check-input"
            />
            Option 1
          </label>
        </div>

        <div className="form-check">
          <label>
            <input
              type="radio"
              name="react-tips"
              value="option2"
              className="form-check-input"
            />
            Option 2
          </label>
        </div>

        <div className="form-check">
          <label>
            <input
              type="radio"
              name="react-tips"
              value="option3"
              className="form-check-input"
            />
            Option 3
          </label>
        </div>

        <div className="form-group">
          <button className="btn btn-primary mt-2" type="submit">
            Save
          </button>
        </div>

      </form>

    </div>
  </div>
</div>
</code>
</pre>
<figcaption class="figure-caption">Code snippet 2.</figcaption>
</figure>

Whoa, that's alot of `<div>` elements! Do we really need them?

Not really. Their purpose is to create a layout using <a href="https://getbootstrap.com/docs/4.2/layout/grid/">Bootstrap grid system</a>. If you're not familiar with Bootstrap - don't worry, just focus on `<form>` element:

<figure class="figure">
<pre>
<code class="language-jsx">
{/* ... */}

<form>

  <div className="form-check">
    <label>
      <input
        type="radio"
        name="react-tips"
        value="option1"
        checked={true}
        className="form-check-input"
      />
      Option 1
    </label>
  </div>

  <div className="form-check">
    <label>
      <input
        type="radio"
        name="react-tips"
        value="option2"
        className="form-check-input"
      />
      Option 2
    </label>
  </div>

  <div className="form-check">
    <label>
      <input
        type="radio"
        name="react-tips"
        value="option3"
        className="form-check-input"
      />
      Option 3
    </label>
  </div>

  <div className="form-group">
    <button className="btn btn-primary mt-2" type="submit">
      Save
    </button>
  </div>

</form>

{/* ... */}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 3.</figcaption>
</figure>

Now let's take a closer look at the first input element:

<figure class="figure">
<pre>
<code class="language-jsx">
<input
  type="radio"
  name="react-tips"
  value="option1"
  checked={true}
  className="form-check-input"
/>
</code>
</pre>
<figcaption class="figure-caption">Code snippet 4.</figcaption>
</figure>

Apart from `checked={true}` and `className="form-check-input"` props it looks exactly as your usual [HTML `<input>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input). However it only _looks_ like one (on purpose I guess). But it works differently, because in this case `<input>` is a React component, not an HTML element!

Just like with any other React component `type`, `value`, `checked` and `className` are component properties. However, user interactions with radio buttons affect `checked`'s value: user can select it and unselect it by selecting another radio button.

If you pass `checked={true}` then React will render:

<figure class="figure">
  <a href="https://fedosejev.github.io/radio-buttons-in-react-16/" target="_blank">
    <img src="./images/selected.png" alt="Selected radio button" class="figure-img img-fluid img-rounded" />
  </a>
  <figcaption class="figure-caption">Figure 2. Selected radio button.</figcaption>
</figure>

If you pass `checked={false}` then React will render:

<figure class="figure">
  <a href="https://fedosejev.github.io/radio-buttons-in-react-16/" target="_blank">
    <img src="./images/unselected.png" alt="Unselected radio button" class="figure-img img-fluid img-rounded" />
  </a>
  <figcaption class="figure-caption">Figure 3. Unselected radio button.</figcaption>
</figure>

We know that if React component can render different things, then it has to maintain state that tells it which thing to render. It's clear that our `<input>` component has 2 states to render: selected radio button and unselected radio button.

Let's make our `App` component stateful:

<figure class="figure">
<pre>
<code class="language-jsx">
import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: "option1"
    };
  }

  render() {
    return ({/* JSX code */});
  }
}

export default App;
</code>
</pre>
<figcaption class="figure-caption">Code snippet 5.</figcaption>
</figure>

In our state object we have `selectedOption` property with the initial value of `option1`. This tells our `App` component which radio button should be selected. Naturally all other radio buttons should be unselected.

In our application we have 3 radio buttons where each of them has 2 states: `selected` and `unselected`. By explicitly specifying which radio button is _selected_, we're also implicitly specifying which should be _unselected_. When you create radio buttons using HTML, the same result is achieved by grouping radio buttons together using `name` HTML attribute.

Now we need to pass `true` or `false` value to `checked` property for all 3 `<input>` components. Only this time the value for `checked` is calculated by comparing component's state with input's name:

<figure class="figure">
<pre>
<code class="language-jsx">
{/* ... */}

<form>

  <div className="form-check">
    <label>
      <input
        type="radio"
        name="react-tips"
        value="option1"
        checked={this.state.selectedOption === "option1"}
        className="form-check-input"
      />
      Option 1
    </label>
  </div>

  <div className="form-check">
    <label>
      <input
        type="radio"
        name="react-tips"
        value="option2"
        checked={this.state.selectedOption === "option2"}
        className="form-check-input"
      />
      Option 2
    </label>
  </div>

  <div className="form-check">
    <label>
      <input
        type="radio"
        name="react-tips"
        value="option3"
        checked={this.state.selectedOption === "option3"}
        className="form-check-input"
      />
      Option 3
    </label>
  </div>

  <div className="form-group">
    <button className="btn btn-primary mt-2" type="submit">
      Save
    </button>
  </div>

</form>

{/* ... */}
</code>

</pre>
<figcaption class="figure-caption">Code snippet 6.</figcaption>
</figure>

Expressions `this.state.selectedOption === 'option1'`, `this.state.selectedOption === 'option2'` and `this.state.selectedOption === 'option3'` will be evaluated into `true` or `false` based on what is component's state and they will tell React how to render our `<input>` elements: selected or unselected.

Notice that we're in control of which `<input>` component should be rendered selected and which - unselected. And by providing `value` property we're taking all of the control over our `<input>` components and turning them into [controlled components](https://facebook.github.io/react/docs/forms.html#controlled-components).

<blockquote class="blockquote">
  <p>A Controlled component does not maintain its own internal state; the component renders purely based on props.</p>
  <footer class="blockquote-footer">From <cite title="React.js documentation"><a href="https://facebook.github.io/react/docs/forms.html#controlled-components">React.js documentation</a></cite></footer>
</blockquote>

However, notice that at the moment, we're rending 3 radio buttons where the first one is selected. If I click on any other 2 - nothing happens. They're not selected. Or to be more specific: they're not rendered any differently.

And that should make sense to you, because when user intracts with our radio buttons we don't update our component's state and hence - don't render them differently. As a result, from the user's point of view: our radio buttons "don't work".

How do we make sure that our component's state changes when use clicks on our radio buttons?

React offers `onChange` property that we can pass to our `<input>` components to handle changes:

<figure class="figure">
<pre>
<code class="language-jsx">
{/* ... */}

<form>

  <div className="form-check">
    <label>
      <input
        type="radio"
        name="react-tips"
        value="option1"
        checked={this.state.selectedOption === "option1"}
        onChange={this.handleOptionChange}
        className="form-check-input"
      />
      Option 1
    </label>
  </div>

  <div className="form-check">
    <label>
      <input
        type="radio"
        name="react-tips"
        value="option2"
        checked={this.state.selectedOption === "option2"}
        onChange={this.handleOptionChange}
        className="form-check-input"
      />
      Option 2
    </label>
  </div>

  <div className="form-check">
    <label>
      <input
        type="radio"
        name="react-tips"
        value="option3"
        checked={this.state.selectedOption === "option3"}
        onChange={this.handleOptionChange}
        className="form-check-input"
      />
      Option 3
    </label>
  </div>

  <div className="form-group">
    <button className="btn btn-primary mt-2" type="submit">
      Save
    </button>
  </div>

</form>

{/* ... */}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 7.</figcaption>
</figure>

Now whenever user clicks on our radio buttons, React will call `handleOptionChange` function.

Let's create that function in our `App` component class:

<figure class="figure">
<pre>
<code class="language-js">
handleOptionChange = changeEvent => {
  this.setState({
    selectedOption: changeEvent.target.value
  });
};
</code>
</pre>
<figcaption class="figure-caption">Code snippet 8.</figcaption>
</figure>

`handleOptionChange` will get `changeEvent` object that we can use to reference the value of `<input>` element that user clicked on: `changeEvent.target.value`. We're assigning that value to `selectedOption` property of our state object and calling `setState()` function to update component's state.

Now React will render our radio buttons differently. Now they're "working" from the user's point of view.

And it's all it takes to implement radio buttons in React.

Our `<input>` components are controlled by us. Or more specifically - by our component's state and user's ability to change that state by interacting with rendered radio buttons.

On the other hand we could have made our `<input>` component [uncontrolled](https://reactjs.org/docs/uncontrolled-components.html) - all we need to do is to remove `value` and `checked` properties from `<input>` components.

<blockquote class="blockquote">
  <p>An uncontrolled component maintains its own internal state.</p>
  <footer class="blockquote-footer">From <cite title="React.js documentation"><a href="https://reactjs.org/docs/uncontrolled-components.html">React.js documentation</a></cite></footer>
</blockquote>

According to React documentation: [uncontroled components](https://reactjs.org/docs/uncontrolled-components.html) maintain their own state - that's why they're called "uncontrolled", because _we_, developers, don't have the control. It's incapsulated inside of the component itself.

However, if we give up the control, we need to pass `name` property to our `<input>` components in order to group them together (like with HTML `<input type="radio">` elements) so that when user selects one radio button - the other ones are then unselected.

Wouldn't it be easier? After all our component would be stateless and we would write less code!

True, but consider this: how would you tell React which radio button should be selected intially? You don't have control, so it wouldn't be straightforward.

Now let's add `onSubmit` property to our `<form>` component:

<figure class="figure">
<pre>
<code class="language-jsx">
<form onSubmit={this.handleFormSubmit}>
{/* ... */}
</form>
</code>
</pre>
<figcaption class="figure-caption">Code snippet 10.</figcaption>
</figure>

When user submits our form we want React to call `handleFormSubmit` function. Let's create it in our `App` component class:

<figure class="figure">
<pre>
<code class="language-js">
handleFormSubmit = formSubmitEvent => {
  formSubmitEvent.preventDefault();

  console.log("You have submitted:", this.state.selectedOption);
};
</code>

</pre>
<figcaption class="figure-caption">Code snippet 11.</figcaption>
</figure>

It gets `formSubmitEvent` object as a parameter. We then `preventDefault()` on it, to prevent the default form submit behaviour.

Finally we log selected option's name in a web browser's console. We get selected option's name from our component's state: `this.state.selectedOption`.

And that's the convinience and the power of being in control of your inputs with React!

Thank you for your attention!

Please take a look at [the complete source code on GitHub](https://github.com/fedosejev/radio-buttons-in-react-16) and [the live version](http://fedosejev.github.io/radio-buttons-in-react-16/) of our app.

I hope you've enjoyed this tutorial and I would love to hear your feedback in the comments. You can get in touch with me via [Twitter](http://twitter.com/artemy) and [email](mailto:artemij@fedosejev.com).

<img src="../__static/images/artemij-fedosejev.jpg" alt="Artemij Fedosejev" class="author-photo clip-shape" />

[Artemij Fedosejev](http://artemij.com)
