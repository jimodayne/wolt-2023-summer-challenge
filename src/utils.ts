import {IFormValue} from "./service";

export const INTEGER_REGEX = /^\d+$/;
export const FLOAT_REGEX = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;

export const validateProps = {
  required: "Value is required",
  min: {
    value: 0,
    message: "Value must be greater than 0",
  },
  pattern: {
    value: FLOAT_REGEX,
    message: "Value must be a number",
  },
};

export const intergerValidateProps = {
  pattern: {
    value: INTEGER_REGEX,
    message: "Value must be a integer",
  },
};

export const convertValuesToNumber = (input: IFormValue<string>): IFormValue<number> => {
  return {
    ...input,
    cartValue: parseFloat(input.cartValue),
    distance: parseInt(input.distance),
    amount: parseInt(input.amount),
  };
};

export const calculateShippingFee = (input: IFormValue<string>): Promise<number> => {
  const {cartValue, distance, amount, time} = convertValuesToNumber(input);

  // The delivery is free (0€) when the cart value is equal or more than 100€.
  if (cartValue >= 100) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(0);
      }, 1000);
    });
  }

  let shippingFee = 0;

  // cart value is less than 10€
  if (cartValue < 10) {
    shippingFee += 10 - cartValue;
  }

  //  first 1000 meters
  shippingFee += 2;

  // after 1000 meters
  if (distance > 1000) {
    const distanceFee = distance - 1000;
    shippingFee += Math.ceil(distanceFee / 500);
  }

  // number of items is five or more
  if (amount >= 5) {
    shippingFee += (amount - 4) * 0.5;
  }

  // extra "bulk" fee applies for more than 12 items of 1,20€
  if (amount > 12) {
    shippingFee += 1.2;
  }

  // if Friday from 3 - 7 PM
  if (isRushTime(time)) {
    shippingFee = shippingFee * 1.2;
  }
  const fee = shippingFee > 15 ? 15 : Math.round(shippingFee * 100) / 100;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fee);
    }, 1000);
  });
};

const isRushTime = (time: Date): boolean => {
  // if Friday from 3 - 7 PM
  const date = new Date(time);
  if (date.getDay() === 5 && date.getHours() >= 15 && date.getHours() <= 19) {
    return true;
  }
  return false;
};
