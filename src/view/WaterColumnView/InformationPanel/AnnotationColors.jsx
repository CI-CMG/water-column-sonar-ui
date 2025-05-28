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
  };

  return (
    <>
      <HuePicker
        width={360}
        height={8}
        color={ annotationColor }
        onChange={(color) => handleChangeAnnotationColorComplete(color)}
      />
    </>
  );
};
