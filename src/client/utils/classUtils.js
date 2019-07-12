import { mapArrToFloat32Array } from './float32Array';

export const mapResponseToClass = ({ label, descriptors }) => {
  const f32ArrDescriptors = descriptors.map(mapArrToFloat32Array);
  return {
    label,
    descriptors: f32ArrDescriptors
  };
};
