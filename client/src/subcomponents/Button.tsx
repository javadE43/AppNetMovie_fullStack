

interface Props {
  onClick?: () => void;
  classButton?: string;
  children?: any;
}

function Button({classButton,onClick,children}:Props) {
  console.log(onClick)
  return( 
    <button
    className={`btn  ${classButton}`}
    onClick={()=>onClick ? () => onClick() : null}
>
    {children}
</button>
    )
}

// export const OutlineButton = ({classButton,onClick,children}:Props) => {
//     return (
//         <Button
//             className={`btn-outline ${classButton}`}
//             onClick={()=>onClick ? () => onClick() : null}
//         >
//             {children}
//         </Button>
//     );
// }

export default Button;
