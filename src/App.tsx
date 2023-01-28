import {useState} from "react";
import {useForm, FormProvider} from "react-hook-form";
import {calculateShippingFee, intergerValidateProps} from "./utils";
import FormItem from "./components/FormItem";
import {IFormValue} from "./service";
import "./App.css";
import Loading from "./components/Loading";

function App() {
  const methods = useForm<IFormValue<string>>();
  const {handleSubmit} = methods;
  const [isLoading, setIsLoading] = useState(false);
  const [shippingFee, setShippingFee] = useState<number | undefined>(undefined);

  const handleSubmitButton = async (values: IFormValue<string>) => {
    setIsLoading(true);
    const shipFee = await calculateShippingFee(values);
    setIsLoading(false);
    setShippingFee(shipFee);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h3>Delivery Fee Calculator</h3>
      </header>

      <FormProvider {...methods}>
        <form className="form-wrapper" onSubmit={handleSubmit(handleSubmitButton)}>
          <FormItem suffix="€" name="cartValue" label="Cart Value" />
          <FormItem suffix="m" name="distance" formProps={intergerValidateProps} label="Delivery Distance" />
          <FormItem name="amount" label="Amount of items" formProps={intergerValidateProps} />
          <FormItem name="time" type="date" label="Time" />

          <button disabled={isLoading} className="submit-btn" type="submit">
            Calculate delivery price
          </button>

          <div className="shipping-fee">
            {isLoading && <Loading />}
            {shippingFee !== undefined && !isLoading && <p> Delivery price: {shippingFee}€ </p>}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}

export default App;
