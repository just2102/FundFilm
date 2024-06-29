import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

import { useCustomSelector } from "src/Redux/useCustomSelector";

import styles from "./EthInput.module.css";

interface Props {
  label: string;
  message: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<FieldValues>;
  currentBalance?: number;
  balanceCheck: boolean;
  defaultValue?: number;
}

const EthInput = ({ label, message, register, errors, currentBalance, balanceCheck, defaultValue }: Props) => {
  const currency = useCustomSelector().web3.currency;

  const validateBalance = (value: number) => {
    if (!currentBalance) return true;
    if (balanceCheck && value > currentBalance) {
      return "Insufficient funds";
    }

    return true;
  };

  const validateInput = (value: string) => {
    const numberValue = parseFloat(value);
    if (isNaN(numberValue)) {
      return "Invalid number format";
    }
    if (/[!@#$%^&*(),?":{}|<>]/g.test(value)) {
      return "Special symbols are not allowed";
    }

    return validateBalance(numberValue);
  };

  return (
    <>
      <label
        htmlFor={label}
        className={styles.label}
      >
        {message}
      </label>
      <div className={styles.ethInput}>
        <input
          defaultValue={defaultValue}
          {...register(`${label}`, {
            required: { value: true, message: "This field is required" },
            min: { value: 0.0049, message: "Should be at least 0.005" },
            max: { value: 50000, message: "Please provide a correct value" },
            validate: validateInput,
          })}
          step='any'
          id={label}
          type='number'
          placeholder='1'
          className={styles.input}
        />
        <select
          name='unit'
          id='unit'
          className={styles.select}
        >
          <option value='eth'>{currency}</option>
        </select>
      </div>
      {errors[label] && (
        <span className='form_error'>
          {errors[label]?.message?.toString()}
          {label === "amount" && errors.balance && <span>{errors.balance.message?.toString()}</span>}
        </span>
      )}
    </>
  );
};

export default EthInput;
