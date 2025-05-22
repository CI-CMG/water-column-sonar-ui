import { HuePicker } from 'react-color';
import {
  selectAnnotationColor,
  updateAnnotationColor,
} from "../../../reducers/store/storeSlice.ts";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks.ts";

export default function AnnotationColors() {

  const dispatch = useAppDispatch();

  const annotationColor = useAppSelector(selectAnnotationColor);

  const handleChangeAnnotationColorComplete = (color) => {
    dispatch(updateAnnotationColor(color.hex ));
    // console.log(`new color: ${annotationColor}`)
  };

  return (
    <>
      <HuePicker
        width={360}
        // height={10}
        color={ annotationColor }
        onChange={(color) => handleChangeAnnotationColorComplete(color)}
      />
    </>
  );
};

// export default AnnotationColors;
