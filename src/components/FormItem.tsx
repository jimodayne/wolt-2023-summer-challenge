import {useFormContext} from "react-hook-form";
import {validateProps} from "../utils";

interface FormItemProps {
  name: string;
  label: string;
  formProps?: any;
  [key: string]: any;
  type?: "text" | "number" | "date";
  suffix?: string;
}

const FormItem = (props: FormItemProps) => {
  const {name, label, formProps, type = "text", suffix = "", ...rest} = props;
  const {
    register,
    formState: {errors},
  } = useFormContext();

  return (
    <div className="form-item">
      <div className="form-item__input">
        <label htmlFor={name}>{label}</label>
        <div style={{display: "flex", alignItems: "center"}}>
          {type === "date" ? (
            <input type="datetime-local" {...register(name, {required: "Value is required", ...formProps})} {...rest} />
          ) : (
            <input {...register(name, {...validateProps, ...formProps})} {...rest} />
          )}
          <span className="suffix">{suffix}</span>
        </div>
      </div>
      <div className="form-item__error">{errors[name] && <small>{errors[name]?.message as string}</small>}</div>
    </div>
  );
};

export default FormItem;
