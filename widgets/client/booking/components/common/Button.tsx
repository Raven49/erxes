import * as React from 'react';

type Props = {
  text: string;
  onClickHandler: () => void;
  color?: string;
  style?: {};
  type: string;
};

function Button({ text, type, onClickHandler, style }: Props) {
  return (
    <button
      type="button"
      className={`btn`}
      onClick={onClickHandler}
      style={style}
    >
      {type === 'back' && <div style={{ fontSize: "1.3em", transform: "rotate(180deg)" }} > &#10140; </div>}
      <div style={{ padding: '5px' }}>{`${text}`}</div>
      {type === 'next' && <div style={{ fontSize: "1.3em" }}>  &#10140; </div>}
    </button>
  );
}

export default Button;
