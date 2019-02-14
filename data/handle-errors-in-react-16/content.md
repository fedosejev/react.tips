# Handle Errors In React 16

How do you handle errors in React 16? When your React component throws an error, it can make your React application unusable, and that can potentially cost your business money.

Let's learn by example why it's a good idea to handle errors in React and how you can do it in React 16.

In this tutorial, we'll build a React app that renders a payment page where users choose a payment method. Our React app will render three different payment methods, but only one of those payment methods will work as expected. The other two payment methods will throw errors. We'll handle one of those erros with Error Boudary feature introduced in React 16, while other error will be left unhandled. You'll see the difference that it makes for users and for a business.

First, let's take a look at the user interface that we want to build:

<figure class="figure">
  <a href="https://fedosejev.github.io/handle-errors-in-react-16/" target="_blank">
    <img src="./images/app-screenshot-payment-methods.png" alt="Application screenshot" class="figure-img img-fluid img-rounded" />
  </a>
  <figcaption class="figure-caption">Figure 1. Our application renders three payment methods.</figcaption>
</figure>

You can find the full source code in <a href="https://github.com/fedosejev/handle-errors-in-react-16">this GitHub repository</a>.

Our application will render three boxes where each box represents a payment method:
1. Credit card payment
2. Debit card payment
3. Bank transfer payment

When user clicks on `Choose ...` button for one of those payment methods we want our application to render a payment form. For example, when user clicks `Choose credit card` - a credit card payment form to be rendered while other payment methods will not be rendered:

<figure class="figure">
  <a href="https://fedosejev.github.io/handle-errors-in-react-16/" target="_blank">
    <img src="./images/app-screenshot-payment-method-form.png" alt="Application screenshot" class="figure-img img-fluid img-rounded" />
  </a>
  <figcaption class="figure-caption">Figure 2. Our application renders credit card payment form.</figcaption>
</figure>

In our example application the `Choose credit card` button will work as expected. However, clicking on `Choose debit card` button will throw an error. This error won't be handled by our application and as a result - our application will crash, our users won't be able to make a payment and our business will lose a sale. Clicking on `Choose bank transfer` button will throw an error as well, however, in this case, our application will handle the error gracefully - it will inform our users about an unexpected error and give them an option to choose another payment method and complete their purchase:

<figure class="figure">
  <a href="https://fedosejev.github.io/handle-errors-in-react-16/" target="_blank">
    <img src="./images/app-screenshot-payment-method-error.png" alt="Application screenshot" class="figure-img img-fluid img-rounded" />
  </a>
  <figcaption class="figure-caption">Figure 3. Our application renders payment method error message.</figcaption>
</figure>

This scenario will clerly demonstrate how a business can make more money by handling errors in React 16.

Let's take a look at how our application will be structured. The task of architecting a React application starts with three questions:
1. What components we need to build?
2. What components hierarchy we need to build?
3. What state our application needs to store and which components will be responsible for storing and managing that state?

Let's answer these questions one at a time.

## What components we need to build?

A good starting point in deciding on what components to create is to look at the UI mockups and break them into reusable elements. In our case, we have payment method box that is rendered three times. We can create a React component for the payment method. We also have a credit card payment method form that we render when user clicks `Pay by credit card` button. We'll create a React component for that payment form as well. We also want to render an error message when we handle an error that is thrown when user clicks on `Pay by bank transfer`. We'll create a React component for the payment method error message. And finally, we'll need to create a "special" React component that will implement the mechanism for handling an error thrown by another React component. This "special" React component will be an Error Boundary component - we'll discuss what it does and how it works shortly in this tutorial.

Excellent, now we have a list of React components that we want to create:
+ `App.js` component will the root component for our entire React application.
+ `PaymentMethod.js` component will render payment method box with a payment name and a button.
+ `PaymentMethodForm.js` component will render credit card payment method form.
+ `PaymentMethodErrorMessage.js` component will render payment method error message.
+ `PaymentMethodErrorBoundary.js` component will handle error thrown by `PaymentMethod.js` component.

Next step is to organise our components into a hierarchy.

## What components hierarchy we need to build?

When we organise components into a hierarchy we decide which componets will be parents, which component will be child components and which components will be both.

We'll start with a parent component that will encapsulate our entire React application - the `App` component. It will have no parent React component, and it will render three child components: two `PaymentMethod` components and one `PaymentMethodErrorBoundary` component.

The `PaymentMethod` component will render `PaymentMethodForm` component or a payment method name with a button.

The `PaymentMethodErrorBoundary` component will render `PaymentMethod` or `PaymentMethodErrorMessage` component.

Here's the visual diagram of our components hierarchy:

<figure class="figure">
  <a href="https://fedosejev.github.io/handle-errors-in-react-16/" target="_blank">
    <img src="./images/diagram-components-hierarchy.png" alt="Components hierarchy diagram" class="figure-img img-fluid img-rounded" />
  </a>
  <figcaption class="figure-caption">Figure 2. Our application.</figcaption>
</figure>

Our application will need state. Let's decide on which components will be responsible for storing and maintaining that state.

## What state our application needs to store and which components will be responsible for storing and managing that state?

The general rule that we want to follow is: the less state our applications has the better. Less state means less state management which means less complexity in our application. However keeping our application as simple as possible is not a trivial task.

The next general rule that we ant to follow is: the fewer stateful components we have the better. We want most of our React component to be stateless, functional components that do only one thing - render user interface.

From the user interface point of view we need state that decides whether to render payment method box with a payment method name and the `Choose ...` button or a payment method form. Your first idea might be to make `PaymentMethod.js` component stateful and let it decide what to render based on that state: a payment name and a payment button or a payment form.

However, the challenge here is that we want to render three instances of `PaymentMethod.js` component and we know that what renders one component instance will have an effect on another two. Earlier we've mentioned that we want to render a payment method form when user clicks on `Choose ...` button and - we don't want to render the other two payment methods when a payment form is rendered. This requirement introduces a mental logical connection between all three instances - they're not completely independent in our application.

Our `App.js` component will render all three instances of `PaymentMethod.js` component. We can't access `PaymentMethod.js` component's state from a parent `App.js` component, so our if we store state in `PaymentMethod.js` component - our `App` component has no way to know when to render all instances of a `PaymentMethod.js` component and when to render only the one that user has selected. That means we can't store state in `PaymentMethod.js` component and we need to store it in a component that is a parent component for all three `PaymentMethod.js` component instances - in our `App.js` component.

Now we know that `App.js` component will be stateful component. We have one other piece of state that our application will need to manage. When user clicks on `Pay by bank transfer` button we want to render the `PaymentMethodErrorMessage` component with an error message. This logic will be handled by `PaymentMethodErrorBoundary.js` component which will be stateful. We'll look at it in more details shortly.

Perfect, we have answered all three questions about architecting our React components and it's time for us to start implementing them.

## Creating `App` component

We'll start with creating the `App.js` component:

<figure class="figure">
<pre>
<code class="language-jsx">
import React, { Component } from "react";
import PaymentMethod from "./PaymentMethod";
import PaymentMethodErrorBoundary from "./PaymentMethodErrorBoundary";
import { PAYMENT_METHODS, NO_PAYMENT_METHOD } from "../config";

class App extends Component {
  state = {
    selectedPaymentMethod: NO_PAYMENT_METHOD
  };

  shouldRenderPaymentMethod = paymentMethod =>
    this.state.selectedPaymentMethod === NO_PAYMENT_METHOD ||
    this.state.selectedPaymentMethod === paymentMethod;

  selectPaymentMethod = paymentMethod => {
    this.setState({
      selectedPaymentMethod: paymentMethod
    });
  };

  cancelPaymentMethod = () => this.selectPaymentMethod(NO_PAYMENT_METHOD);

  render() {
    const showPaymentMethodForm =
      this.state.selectedPaymentMethod !== NO_PAYMENT_METHOD;

    return (
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
            {this.shouldRenderPaymentMethod(PAYMENT_METHODS.CREDIT_CARD) && (
              <PaymentMethod
                name={PAYMENT_METHODS.CREDIT_CARD}
                onSelectPaymentMethod={this.selectPaymentMethod}
                onCancelPaymentMethod={this.cancelPaymentMethod}
                showPaymentMethodForm={showPaymentMethodForm}
              />
            )}

            {this.shouldRenderPaymentMethod(PAYMENT_METHODS.DEBIT_CARD) && (
              <PaymentMethod
                name={PAYMENT_METHODS.DEBIT_CARD}
                onSelectPaymentMethod={this.selectPaymentMethod}
                onCancelPaymentMethod={this.cancelPaymentMethod}
                showPaymentMethodForm={showPaymentMethodForm}
              />
            )}

            {this.shouldRenderPaymentMethod(PAYMENT_METHODS.BANK_TRANSFER) && (
              <PaymentMethodErrorBoundary onError={this.cancelPaymentMethod}>
                <PaymentMethod
                  name={PAYMENT_METHODS.BANK_TRANSFER}
                  onSelectPaymentMethod={this.selectPaymentMethod}
                  onCancelPaymentMethod={this.cancelPaymentMethod}
                  showPaymentMethodForm={showPaymentMethodForm}
                />
              </PaymentMethodErrorBoundary>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
</code>
</pre>
<figcaption class="figure-caption">Code snippet 1. App.js</figcaption>
</figure>

Let's focus on the `App` component's `render` method:

<figure class="figure">
<pre>
<code class="language-jsx">
render() {
  const showPaymentMethodForm =
    this.state.selectedPaymentMethod !== NO_PAYMENT_METHOD;

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
          {this.shouldRenderPaymentMethod(PAYMENT_METHODS.CREDIT_CARD) && (
            <PaymentMethod
              name={PAYMENT_METHODS.CREDIT_CARD}
              onSelectPaymentMethod={this.selectPaymentMethod}
              onCancelPaymentMethod={this.cancelPaymentMethod}
              showPaymentMethodForm={showPaymentMethodForm}
            />
          )}

          {this.shouldRenderPaymentMethod(PAYMENT_METHODS.DEBIT_CARD) && (
            <PaymentMethod
              name={PAYMENT_METHODS.DEBIT_CARD}
              onSelectPaymentMethod={this.selectPaymentMethod}
              onCancelPaymentMethod={this.cancelPaymentMethod}
              showPaymentMethodForm={showPaymentMethodForm}
            />
          )}

          {this.shouldRenderPaymentMethod(PAYMENT_METHODS.BANK_TRANSFER) && (
            <PaymentMethodErrorBoundary onError={this.cancelPaymentMethod}>
              <PaymentMethod
                name={PAYMENT_METHODS.BANK_TRANSFER}
                onSelectPaymentMethod={this.selectPaymentMethod}
                onCancelPaymentMethod={this.cancelPaymentMethod}
                showPaymentMethodForm={showPaymentMethodForm}
              />
            </PaymentMethodErrorBoundary>
          )}
        </div>
      </div>
    </div>
  );
}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 2. App.js</figcaption>
</figure>

The `App` component renders two instances of the `PaymentMethod` component and one instance of the `PaymentMethodErrorBoundary` component.

We render a credit card payment method:

<figure class="figure">
<pre>
<code class="language-jsx">
{this.shouldRenderPaymentMethod(PAYMENT_METHODS.CREDIT_CARD) && (
  <PaymentMethod
    name={PAYMENT_METHODS.CREDIT_CARD}
    onSelectPaymentMethod={this.selectPaymentMethod}
    onCancelPaymentMethod={this.cancelPaymentMethod}
    showPaymentMethodForm={showPaymentMethodForm}
  />
)}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 3. App.js</figcaption>
</figure>

We render a debit card payment method:

<figure class="figure">
<pre>
<code class="language-jsx">
{this.shouldRenderPaymentMethod(PAYMENT_METHODS.DEBIT_CARD) && (
  <PaymentMethod
    name={PAYMENT_METHODS.DEBIT_CARD}
    onSelectPaymentMethod={this.selectPaymentMethod}
    onCancelPaymentMethod={this.cancelPaymentMethod}
    showPaymentMethodForm={showPaymentMethodForm}
  />
)}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 4. App.js</figcaption>
</figure>

And we render a bank transfer payment method:

<figure class="figure">
<pre>
<code class="language-jsx">
{this.shouldRenderPaymentMethod(PAYMENT_METHODS.BANK_TRANSFER) && (
  <PaymentMethodErrorBoundary onError={this.cancelPaymentMethod}>
    <PaymentMethod
      name={PAYMENT_METHODS.BANK_TRANSFER}
      onSelectPaymentMethod={this.selectPaymentMethod}
      onCancelPaymentMethod={this.cancelPaymentMethod}
      showPaymentMethodForm={showPaymentMethodForm}
    />
  </PaymentMethodErrorBoundary>
)}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 5. App.js</figcaption>
</figure>

Out of all three instances of `PaymentMethod` component only the bank transfer one is wrapped into a `PaymentMethodErrorBoundary` component. In other words, we're passing `PaymentMethod` component instance as a child to `PaymentMethodErrorBoundary` component. This tells React that if that `PaymentMethod` method component will throw an error - the `PaymentMethodErrorBoundary` will catch it and handle it. Conversely, the other two instances of `PaymentMethod` component are not wrapped in the `PaymentMethodErrorBoundary` component, so if they throw an error and we know that the debit card payment method will throw an error - it will crash our entire React app.

Earlier we've discussed that we want to render all three payment methods initially and when user select one by clicking the `Choose ...` button - we want to display the payment form for that method and nothing else. This is why we render each payment method conditionally - using the `{this.shouldRenderPaymentMethod(PAYMENT_METHODS.BANK_TRANSFER) && ...` pattern. In this pattern we're calling `this.shouldRenderPaymentMethod` method on our component class and we're passing payment method name to that method. Let's take a look at what this method does:

<figure class="figure">
<pre>
<code class="language-jsx">
shouldRenderPaymentMethod = paymentMethod =>
  this.state.selectedPaymentMethod === NO_PAYMENT_METHOD ||
  this.state.selectedPaymentMethod === paymentMethod;
</code>
</pre>
<figcaption class="figure-caption">Code snippet 6. App.js</figcaption>
</figure>

The `shouldRenderPaymentMethod` method takes `paymentMethod` name as a parameter and checks if the `paymentMethod` in the `App` component's state matches the value of `NO_PAYMENT_METHOD` or the value of `paymentMethod` parameter. The idea here is for `shouldRenderPaymentMethod` method to tell us whether any given payment method should be rendered or not. And the logic here checks if the selected payment method equals to no payment method which is the case initially and in that case we want to render all payment methods. Or if the selected payment method equals to a specific payment method provided by the `paymentMethod` parameter then we want to render only that payment method. In other words, we want to render all three payment methods or only one of the three.

Notice that we import `NO_PAYMENT_METHOD` and `PAYMENT_METHODS` constants from the `config.js` file:

<figure class="figure">
<pre>
<code class="language-jsx">
import { PAYMENT_METHODS, NO_PAYMENT_METHOD } from "../config";
</code>
</pre>
<figcaption class="figure-caption">Code snippet 7. App.js</figcaption>
</figure>

And this is our `config.js` file:

<figure class="figure">
<pre>
<code class="language-jsx">
export const PAYMENT_METHODS = {
  CREDIT_CARD: "credit card",
  DEBIT_CARD: "debit card",
  BANK_TRANSFER: "bank transfer"
};

export const NO_PAYMENT_METHOD = "";
</code>
</pre>
<figcaption class="figure-caption">Code snippet 8. config.js</figcaption>
</figure>

It declares all three payment method names and an empty payment method name in `config.js` file.

We pass payment method names from the `config.js` file to `PaymentMethod` components, for example:

<figure class="figure">
<pre>
<code class="language-jsx">
<PaymentMethod
  name={PAYMENT_METHODS.CREDIT_CARD}
  onSelectPaymentMethod={this.selectPaymentMethod}
  onCancelPaymentMethod={this.cancelPaymentMethod}
  showPaymentMethodForm={showPaymentMethodForm}
/>
</code>
</pre>
<figcaption class="figure-caption">Code snippet 9. App.js</figcaption>
</figure>

The `name` prop passes the payment method name. Let's take a look at other props that we pass to the `PaymentMethod` component:

+ `onSelectPaymentMethod` prop gets a callback function `this.selectPaymentMethod` which is called when user clicks on `Choose ...` button to select a payment method.
+ `onCancelPaymentMethod` prop gets a callback function `this.cancelPaymentMethod` which is called when user clicks `Cancel` button on payment method form. You can see it in action when you click on `Choose credit card` button and then on the `Cancel` button.
+ `showPaymentMethodForm` prop gets a boolean value `showPaymentMethodForm` which tells `PaymentMethod` component whether it should render a payment method form or a payment method name with a button.

We declare `showPaymentMethodForm` variable in the component's `render` method before the `return` statement:

<figure class="figure">
<pre>
<code class="language-jsx">
const showPaymentMethodForm =
  this.state.selectedPaymentMethod !== NO_PAYMENT_METHOD;
</code>
</pre>
<figcaption class="figure-caption">Code snippet 10. App.js</figcaption>
</figure>

You can see that the value of `showPaymentMethodForm` depends on whether `this.state.selectedPaymentMethod` is anything other than `NO_PAYMENT_METHOD`. The idea here is to show payment method name with a `Choose ...` button initially when user hasn't selected any payment method yet. This fact is represented with `NO_PAYMENT_METHOD` value in the `App` component's state:

<figure class="figure">
<pre>
<code class="language-jsx">
state = {
  selectedPaymentMethod: NO_PAYMENT_METHOD
};
</code>
</pre>
<figcaption class="figure-caption">Code snippet 11. App.js</figcaption>
</figure>

When user chooses a payment method we update our component's state to another value that is not `NO_PAYMENT_METHOD`. When user selects a payment method - we want to render a payment method form. This is why `showPaymentMethodForm` variable will have `true` value when one of the payment methods is selected.

What exactly happens when user selects one of the payment methods? The `PaymentMethod` component will call the `App` component's `this.selectPaymentMethod` method and pass payment method name to it as a parameter:

<figure class="figure">
<pre>
<code class="language-jsx">
selectPaymentMethod = paymentMethod => {
  this.setState({
    selectedPaymentMethod: paymentMethod
  });
};
</code>
</pre>
<figcaption class="figure-caption">Code snippet 12. App.js</figcaption>
</figure>

In turn, the `selectPaymentMethod` method will update `App` component's state - it will set `selectedPaymentMethod`'s value to the one that the `PaymentMethod` component passed as a `paymentMethod` parameter.

Now you understand the big picture of how the `App` component manages it's state. It has `selectedPaymentMethod` property that is initially set to `NO_PAYMENT_METHOD` value. Then it updates that property in `selectPaymentMethod` method. And who calls `selectPaymentMethod` method? It's child `PaymentMethod` component.

The `App` component has the `cancelPaymentMethod` method that is a helper method:

<figure class="figure">
<pre>
<code class="language-jsx">
cancelPaymentMethod = () => this.selectPaymentMethod(NO_PAYMENT_METHOD);
</code>
</pre>
<figcaption class="figure-caption">Code snippet 13. App.js</figcaption>
</figure>

What `cancelPaymentMethod` does is it calls `selectPaymentMethod` method passing `NO_PAYMENT_METHOD` as a payment method name - effectively resetting selected payment method name to it's initial value. This will tell React to render all three payment methods once again when the user clicks `Cancel` button on one of the payment method forms.

Now you understand what our `App` component renders and how it works. Next let's take a look at one of it's child components that it renders - the `PaymentMethod` component:

<figure class="figure">
<pre>
<code class="language-jsx">
import React from "react";
import PaymentMethodForm from "./PaymentMethodForm";
import { PAYMENT_METHODS } from "../config";

const PaymentMethod = props => {
  if (
    props.showPaymentMethodForm &&
    props.name === PAYMENT_METHODS.CREDIT_CARD
  ) {
    return (
      <PaymentMethodForm
        onSubmit={event => {
          event.preventDefault();

          console.log("Payment submitted.");
        }}
        onCancel={props.onCancelPaymentMethod}
      />
    );
  }

  if (
    props.showPaymentMethodForm &&
    (props.name === PAYMENT_METHODS.BANK_TRANSFER ||
      props.name === PAYMENT_METHODS.DEBIT_CARD)
  ) {
    throw new Error("Failed to render payment form.");
  }

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Pay by {props.name}</h5>

        <button
          className="btn btn-primary"
          onClick={() => props.onSelectPaymentMethod(props.name)}
        >
          Choose {props.name}
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;
</code>
</pre>
<figcaption class="figure-caption">Code snippet 14. PaymentMethod.js</figcaption>
</figure>

As you can see, the `PaymentMethod` component is a functional React component. It has no state. All it does is renders a user interface. Let's take a closer look at what user interface it renders:

<figure class="figure">
<pre>
<code class="language-jsx">
return (
  <div className="card mb-3">
    <div className="card-body">
      <h5 className="card-title">Pay by {props.name}</h5>

      <button
        className="btn btn-primary"
        onClick={() => props.onSelectPaymentMethod(props.name)}
      >
        Choose {props.name}
      </button>
    </div>
  </div>
);
</code>
</pre>
<figcaption class="figure-caption">Code snippet 15. PaymentMethod.js</figcaption>
</figure>

It renders a header and a button. The header has a payment method name that comes with the `name` prop. And the `Choose ...` button calls `onSelectPaymentMethod` function that is passed to `PaymentMethod` component as a prop as well. The `onSelectPaymentMethod` is a callback function that `PaymentMethod` component calls to communicate back to it's parent `App` component that user has selected payment method with a name `name`.

When you run our React app, you see three payment methods rendered by `PaymentMethod` component. That's what we want the `PaymentMethod` component to render by default. However, remember that we also want our `PaymentMethod` component to render a payment method form when user selects that payment method. This is why before returning a header and a button, we check if one of the payment methods is selected:

<figure class="figure">
<pre>
<code class="language-jsx">
if (
  props.showPaymentMethodForm &&
  props.name === PAYMENT_METHODS.CREDIT_CARD
) {
  return (
    <PaymentMethodForm
      onSubmit={event => {
        event.preventDefault();

        console.log("Payment submitted.");
      }}
      onCancel={props.onCancelPaymentMethod}
    />
  );
}

if (
  props.showPaymentMethodForm &&
  (props.name === PAYMENT_METHODS.BANK_TRANSFER ||
    props.name === PAYMENT_METHODS.DEBIT_CARD)
) {
  throw new Error("Failed to render payment form.");
}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 16. PaymentMethod.js</figcaption>
</figure>

In this tutorial we want to demonstrate three different scenarios:
1. User clicks on a credit card payment method and it works as expected.
2. User clicks on a debit card payment method and it throws an error that our app doesn't handle.
3. User clicks on a bank transfer payment method and it throws an error that our app handles with an Error Boundary component.

We use two `if` statements to describe all three scenarios. Both `if` statements check if the `PaymentMethod` component should render a payment method form. If not, it the `PaymentMethod` component will render payment method name and a `Choose ...` button. If `props.showPaymentMethodForm` is `true`, which means that the `App` component wants `PaymentMethod` component render to render a payment method form, then the next question is: what payment method this `PaymentMethod` component instance represents? We answer this question by checking if the payment method name equals to one of three options: `props.name === PAYMENT_METHODS.CREDIT_CARD`, `props.name === PAYMENT_METHODS.BANK_TRANSFER` and `props.name === PAYMENT_METHODS.DEBIT_CARD`.

In the first scenario we have a credit card payment method and in that scenario - we want to render a payment method form:

<figure class="figure">
<pre>
<code class="language-jsx">
if (
  props.showPaymentMethodForm &&
  props.name === PAYMENT_METHODS.CREDIT_CARD
) {
  return (
    <PaymentMethodForm
      onSubmit={event => {
        event.preventDefault();

        console.log("Payment submitted.");
      }}
      onCancel={props.onCancelPaymentMethod}
    />
  );
}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 17. PaymentMethod.js</figcaption>
</figure>

This is what the first `if` statement checks for. If `props.showPaymentMethodForm && props.name === PAYMENT_METHODS.CREDIT_CARD` is `true` then the `PaymentMethod` component renders `PaymentMethodForm` component:

<figure class="figure">
<pre>
<code class="language-jsx">
<PaymentMethodForm
  onSubmit={event => {
    event.preventDefault();

    console.log("Payment submitted.");
  }}
  onCancel={props.onCancelPaymentMethod}
/>
</code>
</pre>
<figcaption class="figure-caption">Code snippet 18. PaymentMethod.js</figcaption>
</figure>

The `PaymentMethodForm` component gets `onSubmit` and `onCancel` props. We pass a function that logs `Payment submitted.` message in JavaScript console to `onSubmit` prop. And we pass `prop.onCancelPaymentMethod` value to `onCancel` prop. The `PaymentMethod` component gets that `onCancelPaymentMethod` as a prop from it's parent `App` component. This is an example of a prop that `PaymentMethod` component doesn't use itself, but it needs to pass it to it's child `PaymentMethodForm` component.

In the second and the third scenarios we have a debit card and a bank transfer payment methods and in those scenarios we want to throw an error, instead of returning a payment method form:

<figure class="figure">
<pre>
<code class="language-jsx">
if (
  props.showPaymentMethodForm &&
  (props.name === PAYMENT_METHODS.BANK_TRANSFER ||
    props.name === PAYMENT_METHODS.DEBIT_CARD)
) {
  throw new Error("Failed to render payment form.");
}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 19. PaymentMethod.js</figcaption>
</figure>

Now that you understand what our `PaymentMethod` component does and how it works, let's take a look at the `PaymentMethodForm` component next:

<figure class="figure">
<pre>
<code class="language-jsx">
import React from "react";

const PaymentMethodForm = props => (
  <div className="card mb-3">
    <div className="card-body">
      <h5 className="card-title">Pay by credit card</h5>
      <form onSubmit={props.onSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            aria-describedby="name"
            placeholder="Enter name"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            aria-describedby="number"
            placeholder="Enter number"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            aria-describedby="expirationDate"
            placeholder="Enter expiration date"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            aria-describedby="CVV"
            placeholder="Enter CVV"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Pay now
        </button>
        <button type="button" className="btn btn-link" onClick={props.onCancel}>
          Cancel
        </button>
      </form>
    </div>
  </div>
);

export default PaymentMethodForm;
</code>
</pre>
<figcaption class="figure-caption">Code snippet 20. PaymentMethodForm.js</figcaption>
</figure>

The `PaymentMethodForm` component is a functional component that renders a credit card payment form. It gets `onSubmit` and on `onCancel` props from a parent `PaymentMethod` component. When user clicks `Pay now` button, the `onSubmit` prop is called. When user clicks on `Cancel` button, the `onCancel` prop is called. As simple as that.

Now you understand how our `App`, `PaymentMethod` and `PaymentMethodForm` components work. Remember that in two different scenarios the `PaymentMethod` component throws an error. However, only in one scenario we handle that error in our `App` component with an Error Boundary. Let's take a closer look at how we do it:

<figure class="figure">
<pre>
<code class="language-jsx">
{this.shouldRenderPaymentMethod(PAYMENT_METHODS.BANK_TRANSFER) && (
  <PaymentMethodErrorBoundary onError={this.cancelPaymentMethod}>
    <PaymentMethod
      name={PAYMENT_METHODS.BANK_TRANSFER}
      onSelectPaymentMethod={this.selectPaymentMethod}
      onCancelPaymentMethod={this.cancelPaymentMethod}
      showPaymentMethodForm={showPaymentMethodForm}
    />
  </PaymentMethodErrorBoundary>
)}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 21. App.js</figcaption>
</figure>

When user clicks on the bank transfer payment method the `PaymentMethod` component throws an error. We want to catch that error to prevent our entire React app from crashing. To do that we create the `PaymentMethodErrorBoundary` component and wrap the `PaymentMethod` component into it.

Let's take a look at our `PaymentMethodErrorBoundary` component:

<figure class="figure">
<pre>
<code class="language-jsx">
import React, { Component } from "react";
import PaymentMethodErrorMessage from "./PaymentMethodErrorMessage";

class PaymentMethodErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return <PaymentMethodErrorMessage />;
    }

    return this.props.children;
  }
}

export default PaymentMethodErrorBoundary;
</code>
</pre>
<figcaption class="figure-caption">Code snippet 22. PaymentMethodErrorBoundary.js</figcaption>
</figure>

Let's take a closer look at what our `PaymentMethodErrorBoundary` component renders:

<figure class="figure">
<pre>
<code class="language-jsx">
render() {
  if (this.state.hasError) {
    return <PaymentMethodErrorMessage />;
  }

  return this.props.children;
}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 23. PaymentMethodErrorBoundary.js</figcaption>
</figure>

It renders two different things depending on it's state. Our `PaymentMethodErrorBoundary` is a stateful component. It's initial state looks like this:

<figure class="figure">
<pre>
<code class="language-jsx">
state = { hasError: false };
</code>
</pre>
<figcaption class="figure-caption">Code snippet 24. PaymentMethodErrorBoundary.js</figcaption>
</figure>

The idea is to render two different things depending whether our `PaymentMethodErrorBoundary` component caught an error or not. We create `hasError` state property and set it initially to `false`. Later you'll see that we update `hasError`'s value to `true` when our `PaymentMethodErrorBoundary` component catches an error.

If we didn't catch an error, we want our `PaymentMethodErrorBoundary` component to render it's `children` prop: `return this.props.children;`. This allows us to nest `PaymentMethod` component inside of the `PaymentMethodErrorBoundary` component:

<figure class="figure">
<pre>
<code class="language-jsx">
<PaymentMethodErrorBoundary onError={this.cancelPaymentMethod}>
  <PaymentMethod
    name={PAYMENT_METHODS.BANK_TRANSFER}
    onSelectPaymentMethod={this.selectPaymentMethod}
    onCancelPaymentMethod={this.cancelPaymentMethod}
    showPaymentMethodForm={showPaymentMethodForm}
  />
</PaymentMethodErrorBoundary>
</code>
</pre>
<figcaption class="figure-caption">Code snippet 25. App.js</figcaption>
</figure>

If we did catch an error, then we want our `PaymentMethodErrorBoundary` component to render something other than the `PaymentMethod` component that throws an error. In our app we render `PaymentMethodErrorMessage` component instead:

<figure class="figure">
<pre>
<code class="language-jsx">
if (this.state.hasError) {
  return <PaymentMethodErrorMessage />;
}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 26. PaymentMethodErrorBoundary.js</figcaption>
</figure>

Let's take a quick look at what `PaymentMethodErrorMessage` renders:

<figure class="figure">
<pre>
<code class="language-jsx">
import React from "react";

const PaymentMethodError = () => (
  <div className="card mb-3">
    <div className="card-body">
      <h5 className="card-title">We're sorry</h5>
      <p className="card-text">
        Unfortunately, this payment method is not available at the moment.
      </p>
    </div>
  </div>
);

export default PaymentMethodError;
</code>
</pre>
<figcaption class="figure-caption">Code snippet 27. PaymentMethodErrorBoundary.js</figcaption>
</figure>

The `PaymentMethodErrorMessage` component is a functional component that renders an informative user-friendly error message.

Now we know what `PaymentMethodErrorBoundary` component renders. It's time to for us to understand how it works.

You already know that it's a stateful component and it's initial state is: `state = { hasError: false };`. What makes `PaymentMethodErrorBoundary` component an error boundary component rather than just another presentational component is the fact that it has one of those two component lifecycle methods: `getDerivedStateFromError` and `componentDidCatch`.

Let's take a closer look at `getDerivedStateFromError` method first:

<figure class="figure">
<pre>
<code class="language-jsx">
static getDerivedStateFromError() {
  return { hasError: true };
}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 28. PaymentMethodErrorBoundary.js</figcaption>
</figure>

`getDerivedStateFromError` is a lifecycle method that React calls after it's child `PaymentMethod` component throws an error. This is a lifecycle component method that we use to update `PaymentMethodErrorBoundary` component's state - we want to set `hasError` to `true`. Updating component's state will force React to re-render `PaymentMethodErrorBoundary` component and with a new state it will render `PaymentMethodErrorMessage` component instead of `this.props.children`. As you can see we use `getDerivedStateFromError` lifecycle method as part of our fallback mechanism: if no error, then render `this.props.children` prop, if error, then render `PaymentMethodErrorMessage` component.

 After rendering an error message instead of a payment method form, we want our users to have a chance to choose a different payment method - the one that doesn't throw an error. This logic helps us to gracefully degrade our service and enables our users to still make a payment. Good for users, good for business.

How do we make sure that our `App` component will render three payment methods once again after user has select one of the payment methods that threw an error? That's what we use the `componentDidCatch` lifecycle method for:

<figure class="figure">
<pre>
<code class="language-jsx">
componentDidCatch() {
  this.props.onError();
}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 29. PaymentMethodErrorBoundary.js</figcaption>
</figure>

React will call `componentDidCatch` method after catching an error and re-rendering our `PaymentMethodErrorBoundary` component with a fallback user interface - with `PaymentMethodErrorMessage` component in our case.

What we want to do in `componentDidCatch` is to call `onError` callback prop that `App` component passes to `PaymentMethodErrorBoundary` component. `onError` will call `App` component's `cancelPaymentMethod` method that will in turn reset `App` component's state to `{ selectedPaymentMethod: NO_PAYMENT_METHOD };`. Without having a payment method selected our `App` component will render all three payment methods and our users can choose another payment method. Winning.

Now you know how to handle errors in React 16 with Error Boundary components. <a href="https://reactjs.org/docs/error-boundaries.html" target="_blank">Here you can learn more about Error Boundaries in React</a>.

I hope you've enjoyed this tutorial. If you have any questions or suggestions for the next tutorial, then please leave a comment.

Thank you for your attention!
















We render a credit card payment method:

<figure class="figure">
<pre>
<code class="language-jsx">
{this.shouldRenderPaymentMethod(PAYMENT_METHODS.CREDIT_CARD) && (
  <PaymentMethod
    name={PAYMENT_METHODS.CREDIT_CARD}
    onProcessPayment={this.processPayment}
    onCancel={this.cancelPayment}
    isProcessingPayment={this.state.isProcessingPayment}
  />
)}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 2. App.js</figcaption>
</figure>

Then we render a debit card payment method:

<figure class="figure">
<pre>
<code class="language-jsx">
{this.shouldRenderPaymentMethod(PAYMENT_METHODS.DEBIT_CARD) && (
  <PaymentMethod
    name={PAYMENT_METHODS.DEBIT_CARD}
    onProcessPayment={this.processPayment}
    isProcessingPayment={this.state.isProcessingPayment}
  />
)}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 2. App.js</figcaption>
</figure>

And finally we render a bank transfer payment method:

<figure class="figure">
<pre>
<code class="language-jsx">
{this.shouldRenderPaymentMethod(PAYMENT_METHODS.BANK_TRANSFER) && (
  <PaymentMethodErrorBoundary onError={this.cancelPayment}>
    <PaymentMethod
      name={PAYMENT_METHODS.BANK_TRANSFER}
      onProcessPayment={this.processPayment}
      isProcessingPayment={this.state.isProcessingPayment}
    />
  </PaymentMethodErrorBoundary>
)}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 2. App.js</figcaption>
</figure>

Notice that all three payment methods create an instance of `PaymentMethod` component, but only bank transfer payment method wraps it inside of a `PaymentMethodErrorBoundary` component. In this example, we'll have scenario where:
1. Credit card payment method works as expected.
2. Debit card payment method throws an error that we don't handle.
3. Bank transfer method throws an error that we catch with an error boundary component called `PaymentMethodErrorBoundary`.

credit card and debit card payment methods are 


We want users to select one payment method. When a user selects one payment method we don't render the other two. To achieve that we use <a href="https://reactjs.org/docs/conditional-rendering.html" target="_blank">conditional rendering</a>:

<figure class="figure">
<pre>
<code class="language-jsx">
{this.shouldRenderPaymentMethod(PAYMENT_METHODS.BANK_TRANSFER) && (
  /* Render payment method */
)}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 2. App.js</figcaption>
</figure>






 with a credit card, with a debit card and via bank transfer.

We see three `div` elements with class names that you might recognize if you're familiar with [Bootstrap](http://getbootstrap.com). Bootstrap helps us create layout for our page.






We use conditional rendering t



Now let's focus on the `form` element:

<figure class="figure">
<pre>
<code class="language-jsx">
<form onSubmit={this.handleFormSubmit}>
  {this.createCheckboxes()}

  <div className="form-group mt-2">
    <button
      type="button"
      className="btn btn-outline-primary mr-2"
      onClick={this.selectAll}
    >
      Select All
    </button>
    <button
      type="button"
      className="btn btn-outline-primary mr-2"
      onClick={this.deselectAll}
    >
      Deselect All
    </button>
    <button type="submit" className="btn btn-primary">
      Save
    </button>
  </div>
</form>
</code>
</pre>
<figcaption class="figure-caption">Code snippet 3. App.js</figcaption>
</figure>

Inside of our `form` element we call `this.createCheckboxes` function that creates three instances of a `Checkbox` component. We'll see how this function works in a moment. It's important to recognise that here we're creating our instances of a `Checkbox` component __dynamically__. If you're not familiar with this approach, then please read [this tutorial](http://react.tips/how-to-create-reactjs-components-dynamically/) first.

We then create three instances of `button` element.

The first `Select All` button will select all checkboxes:

<figure class="figure">
<pre>
<code class="language-jsx">
<button
  type="button"
  className="btn btn-outline-primary mr-2"
  onClick={this.selectAll}
>
  Select All
</button>
</code>
</pre>
<figcaption class="figure-caption">Code snippet 4. App.js</figcaption>
</figure>

When it's clicked it calls `this.selectAll` function. Later we'll see what that function does.

The second `Deselect All` button will deselect all checkboxes:

<figure class="figure">
<pre>
<code class="language-jsx">
<button
  type="button"
  className="btn btn-outline-primary mr-2"
  onClick={this.deselectAll}
>
  Deselect All
</button>
</code>
</pre>
<figcaption class="figure-caption">Code snippet 5. App.js</figcaption>
</figure>

When it's clicked it calls `this.deselectAll` function. Later we'll see what that function does.

The third `Save` button is of type `submit` which will submit our form when user clicks on it:

<figure class="figure">
<pre>
<code class="language-jsx">
<button type="submit" className="btn btn-primary">
  Save
</button>
</code>
</pre>
<figcaption class="figure-caption">Code snippet 6. App.js</figcaption>
</figure>

In our `form` element we're telling React to call `this.handleFormSubmit` function when user submits the form:

<figure class="figure">
<pre>
<code class="language-jsx">
<form onSubmit={this.handleFormSubmit}>
{/* ... */}
</form>
</code>
</pre>
<figcaption class="figure-caption">Code snippet 7. App.js</figcaption>
</figure>

Next let's take a look at how exactly we're creating our instances of `Checkbox` component dynamically. Here is our `createCheckboxes` function:

<figure class="figure">
<pre>
<code class="language-jsx">
createCheckboxes = () => OPTIONS.map(this.createCheckbox);
</code>
</pre>
<figcaption class="figure-caption">Code snippet 8. App.js</figcaption>
</figure>

It iterates over `OPTIONS` array and calls `this.createCheckbox` function for each item in that array. Where is `OPTIONS` array coming from and what is it for?

In our `App.js` file before declaring our `App` component, we've create `OPTIONS` constant that references an array of three items:

<figure class="figure">
<pre>
<code class="language-js">
const OPTIONS = ["One", "Two", "Three"];
</code>
</pre>
<figcaption class="figure-caption">Code snippet 9. App.js</figcaption>
</figure>

`['One', 'Two', 'Three']` - these are labels for our checkboxes. This array represents data that will dictate how many checkboxes we need to render and what their labels will be. For the purpose of this tutorial, we declare this data in our React component file, but in a real world web application this data can be received from a server or imported from another file.

Now we know that `createCheckboxes` function calls `this.createCheckbox` function for each label in `OPTIONS` array. `createCheckboxes` function also returns an array of three instances of `Checkbox` component. That's because we call `this.createCheckbox` three times and each time it creates and returns an individual `Checkbox` component instance:

<figure class="figure">
<pre>
<code class="language-js">
createCheckbox = option => (
  <Checkbox
    label={option}
    isSelected={this.state.checkboxes[option]}
    onCheckboxChange={this.handleCheckboxChange}
    key={option}
  />
);
</code>
</pre>
<figcaption class="figure-caption">Code snippet 10. App.js</figcaption>
</figure>

Each `Checkbox` component instance gets four properties:
1. `label` - the text that you see rendered next to a checkbox. This value is coming from our `OPTIONS` array.
2. `isSelected` - `true` or `false` value that tells `Checkbox` component whether it should render selected or deselected checkbox.
3. `onCheckboxChange` - a reference to `this.handleCheckboxChange` function. Every time user selects/deselects a checkbox React calls `this.handleCheckboxChange` function passing `change` event to it. We'll see how it works in a moment.
4. `key` - as you already know, each dynamically created React component instance needs a `key` property that React uses to uniquely identify that instance.

Now we understand how we create and render three checkboxes in our application. What happens when user selects/deselects our checkboxes? As you will see later - every time user changes checkbox's state - our `this.handleCheckboxChange` is called.

It's a good time to zoom out for a minute and talk about how our application works. There are a couple of questions we need to ask:

1. Each checkbox has two states: selected and deselected. Which React component is responsible for managing that state?
2. How do we know which checkboxes are selected at any given moment in time?

We want to keep our application as simple as possible, so our `App` component will be responsible for maintaining the state of each checkbox. Meaning: each `Checkbox` component will be a controlled component that is not responsible for managing it's own state. Instead `Checkbox` component will receive `isSelected` prop, render `input` element based on that prop and call `onCheckboxChange` callback prop when user interacts with it.

Have you noticed that we need to maintain the state of each checkbox for _two different_ purposes? Let's take a closer look, this is important. In React, a form element that users can interact with has to have a state in order be rendered differently in response to user actions. That what makes a React component interactive: it's rendered one way, then user interacts with it and now it's rendered in another way. We know that changes in component's props or state will force React to re-render that component. Without that state, form elements will be useless, because they will always render the same way, regardless of what user does. They will feel unresponsive to a user. You can see that the purpose of that state is _mechanical_ - it's purpose is to make an interactive UI component simply _work_. That's it.

Most often than not, you wouldn't render a UI component without a business reason. Why do we want to render a checkbox as part of our form? Well, we want to know user's preference for whatever choice options that checkbox represents and then submit it as part of the form. But where do we store that user preference before submitting the form? Notice that this user preference is our business state or our application state that lives in our React application. Does it mean that it should live in a component's state? No, as it's not React's responsibility to manage application's state. We can use Redux library, or plain JavaScript for that.

However, in this tutorial, we'll recognize that the two states: our _UI state_ that we need for our checkboxes to work and our _application state_ that we need for our application to make business sense - those two states with two different purposes can be represented with a single state. This state will live in the `App` component.

Why do we want to store state of the each checkbox in the parent `App` component instead of letting each checkbox to maintain it's own state? In <a href="/checkboxes-in-react/">the previous version of this tutorial</a> I've made a case that the parent `App` component doesn't need to know the state of each checkbox. It needs to know which checkboxes are selected in order to log them in a console when user clicks the `Save` button. However, in one of the comments **Juan Leone** asked how to select or deselect _all_ checkboxes at once:

<figure class="figure">
  <a href="/checkboxes-in-react/#comment-3545667834" target="_blank">
    <img src="./images/comment.png" alt="Application screenshot" class="figure-img img-fluid img-rounded" />
  </a>
  <figcaption class="figure-caption">Figure 3. Juan's comment.</figcaption>
</figure>

The question is how the `App` component can control the state of it's child `Checkbox` components, without managing their state? The short answer is: it can't. When you make a React component stateful, the state becomes private to that component only. Parent components can't access it directly. Child components can only get access to it via props. That's one of the core ideas in React and your architectural challenge is to decide which components own what state.

In this tutorial I've added a new business requirement for our application: we need to have a button that selects all checkboxes and a button that deselects all checkboxes. This requirement will address Juan's comment and give you an example of how to manage application state in a parent component.

Let's declare our application state in the `App` component:

<figure class="figure">
<pre>
<code class="language-js">
state = {
  checkboxes: OPTIONS.reduce(
    (options, option) => ({
      ...options,
      [option]: false
    }),
    {}
  )
};
</code>
</pre>
<figcaption class="figure-caption">Code snippet 12. App.js</figcaption>
</figure>

We use [class property](https://babeljs.io/docs/plugins/transform-class-properties/) `state` to set the initial state of the `App` component.

Don't get scared by that `reduce` function:

<figure class="figure">
<pre>
<code class="language-js">
OPTIONS.reduce(
  (options, option) => ({
    ...options,
    [option]: false
  }),
  {}
)
</code>
</pre>
<figcaption class="figure-caption">Code snippet 11. App.js</figcaption>
</figure>

All it does is transforms `["One", "Two", "Three"]` array to `{ "One": false, "Two": false, "Three": false }` object. This object is the shape of our state that represents two states: UI state for each `Checkbox` component and an application state for our entire application. In our state `false` means that user hasn't selected the checkbox and we want every checkbox to be initially rendered as unchecked. Option name represents the name of a checkbox, i.e. `"One"`, `"Two"`, `"Three"`.

+ The UI state answers the question: _which checkbox should I render selected and which - deselected?_
+ The application state answers the question: _which checkboxes user selected?_

As you can see those two states are tightly coupled and related - you can't render selected checkbox and at the same time assume that user's intention is to have it unselected. If you can think of a business case where your UI state will differ from your application state - you need to maintain them separately as two different states.

Now we know the shape of the `App` component's state:

<figure class="figure">
<pre>
<code class="language-js">
{
  One: false,
  Two: false,
  Three: false,
}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 12. App.js</figcaption>
</figure>

Let's look at the `this.handleCheckboxChange` function and understand how to change this state when user interacts with our checkboxes:

<figure class="figure">
<pre>
<code class="language-js">
handleCheckboxChange = changeEvent => {
  const { name } = changeEvent.target;

  this.setState(prevState => ({
    checkboxes: {
      ...prevState.checkboxes,
      [name]: !prevState.checkboxes[name]
    }
  }));
};
</code>
</pre>
<figcaption class="figure-caption">Code snippet 13. App.js</figcaption>
</figure>

It gets a _changeEvent_ object and accesses _name_ property that represents which checkbox is being toggled. Now what exactly _handleCheckboxChange_ function does? It calls `this.setState` to request an update of the state and passes a function that gets a previous state and returns a new state that is created based on the previous state. The `name` property that comes with the `changeEvent` object becomes the key in our new state object and the value for that key becomes the opposite value of the value in the previous state:

<figure class="figure">
<pre>
<code class="language-js">
checkboxes: {
  ...prevState.checkboxes,
  [name]: !prevState.checkboxes[name]
}
</code>
</pre>
<figcaption class="figure-caption">Code snippet 14. App.js</figcaption>
</figure>

This is how we toggle a checkbox in our application state. The `handleCheckboxChange` function toggles state of an individual checkbox. How do we change state for all checkboxes at once?

Let's look at our `this.selectAll` and `this.deselectAll` functions.

The `this.selectAll` function calls `this.selectAllCheckboxes` and passes `true` as an argument:

<figure class="figure">
<pre>
<code class="language-js">
selectAll = () => this.selectAllCheckboxes(true);
</code>
</pre>
<figcaption class="figure-caption">Code snippet 15. App.js</figcaption>
</figure>

While `this.deselectAll` function calls `this.selectAllCheckboxes` and passes `false` as an argument:

<figure class="figure">
<pre>
<code class="language-js">
selectAll = () => this.selectAllCheckboxes(false);
</code>
</pre>
<figcaption class="figure-caption">Code snippet 16. App.js</figcaption>
</figure>

Let's take a look at what `this.selectAllCheckboxes` does:

<figure class="figure">
<pre>
<code class="language-js">
selectAllCheckboxes = isSelected => {
  Object.keys(this.state.checkboxes).forEach(checkbox => {
    // BONUS: Can you explain why we pass updater function to setState instead of an object?
    this.setState(prevState => ({
      checkboxes: {
        ...prevState.checkboxes,
        [checkbox]: isSelected
      }
    }));
  });
};
</code>
</pre>
<figcaption class="figure-caption">Code snippet 17. App.js</figcaption>
</figure>

It iterates over the `checkboxes` that we have in our application state and for each checkbox it updates it's state to the value of the `isSelected` parameter. Can you explain why we must pass an updater function to `this.setState` here, instead of an object?

Now we have a React application that renders a form with three checkboxes and three buttons. What happens when a user clicks the `Save` button? Our form is submitted and our `handleFormSubmit` function is called by React:

<figure class="figure">
<pre>
<code class="language-jsx">
<form onSubmit={this.handleFormSubmit}>...</form>
</code>
</pre>
<figcaption class="figure-caption">Code snippet 18. App.js</figcaption>
</figure>

Let's take a look at `handleFormSubmit` function:

<figure class="figure">
<pre>
<code class="language-jsx">
handleFormSubmit = formSubmitEvent => {
  formSubmitEvent.preventDefault();

  Object.keys(this.state.checkboxes)
    .filter(checkbox => this.state.checkboxes[checkbox])
    .forEach(checkbox => {
      console.log(checkbox, "is selected.");
    });
};
</code>
</pre>
<figcaption class="figure-caption">Code snippet 19. App.js</figcaption>
</figure>

First it prevents the default behavior of a form's submit event:

<figure class="figure">
<pre>
<code class="language-js">
formSubmitEvent.preventDefault();
</code>
</pre>
<figcaption class="figure-caption">Code snippet 20. App.js</figcaption>
</figure>

And then it iterates over all checkboxes in our application state, filters the ones that are selected and logs their name in a console:

<figure class="figure">
<pre>
<code class="language-js">
Object.keys(this.state.checkboxes)
  .filter(checkbox => this.state.checkboxes[checkbox])
  .forEach(checkbox => {
    console.log(checkbox, "is selected.");
  });
</code>
</pre>
<figcaption class="figure-caption">Code snippet 21. App.js</figcaption>
</figure>

Now you know what our `App` component does and how it works.

Next let's take a look at our `Checkbox` component:

<figure class="figure">
<pre>
<code class="language-jsx">
import React from "react";

const Checkbox = ({ label, isSelected, onCheckboxChange }) => (
  <div className="form-check">
    <label>
      <input
        type="checkbox"
        name={label}
        checked={isSelected}
        onChange={onCheckboxChange}
        className="form-check-input"
      />
      {label}
    </label>
  </div>
);

export default Checkbox;
</code>
</pre>
<figcaption class="figure-caption">Code snippet 22. Checkbox.js</figcaption>
</figure>

Our `Checkbox` component is a stateless functional component that receives three props:
1. `label` is a text that represents the name of the checkbox and it also rendered next to that checkbox.
2. `isSelected` is a boolean value that tells React whether that checkbox should be rendered selected or deselected.
3. `onCheckboxChange` is a callback function that React will call when a user selects or deselects the checkbox.

The `Checkbox` component renders `div` element with a Bootstrap class name that we use for styling. Inside of it we have `label` element with two children:

1. `input` element
2. `label` text

The `input` element renders the checkbox. It has 4 properties:
1. `type` - the type of the input: `checkbox` in our case.
2. `name` - the name of the input: an option name passed as a prop from a parent `App` component. It will be either `One`, `Two` or `Three`.
3. `checked` - whether the checkbox is selected or not. The value comes from the prop from a parent `App` component.
4. `onChange` - the `change` event handler: `onCheckboxChange` function will be called when user selects or deselects the checkbox.

If you read [this tutorial](http://react.tips/radio-buttons-in-react-16/), you will recognize that our `input` element is a [controlled component](https://facebook.github.io/react/docs/forms.html#controlled-components) because we "control" the `checked` property by providing our own value that comes from `isSelected` prop. If you're not sure about the difference between controlled components and uncontrolled components, then I recommend you read [this tutorial](http://react.tips/radio-buttons-in-react-16/).

What happens when a user toggles our checkbox? React calls our `onCheckboxChange` callback function that references `handleCheckboxChange` function in a parent `App` component. `handleCheckboxChange` will update `App` component's state and the `App` component will re-render all `Checkbox` components.

That's how our `App` component will always know which checkboxes are selected at any given moment in time.

And now you know how to use checkboxes in React.js!

Notice that this solution works great for _our specific_ requirements. If you have different requirements you might need to think of a different way of creating checkboxes.

Thank you for reading this React tutorial!

Please take a look at [the complete source code on GitHub](https://github.com/fedosejev/checkboxes-in-react-16) and [the live version](https://fedosejev.github.io/checkboxes-in-react-16/) of our app.

I hope you've enjoyed this tutorial and I would love to hear your feedback in the comments. You can get in touch with me via [Twitter](http://twitter.com/artemy) and [email](mailto:artemij@fedosejev.com).

<img src="../__static/images/artemij-fedosejev.jpg" alt="Artemij Fedosejev" class="author-photo clip-shape" />

[Artemij Fedosejev](http://artemij.com)
