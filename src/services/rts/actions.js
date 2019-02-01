export const RTS_REQUEST = "rts:requrest";
export const RTS_RESULT = "rts:result";
export const RTS_ERROR = "rts:error";

export function rtsRequest(filter, dataUUID, field, cb, noSpin) {
  return {
    type: RTS_REQUEST,
    filter,
    dataUUID,
    field,
    cb,
    noSpin
  };
}

export function rtsResult(data, dataUUID, field) {
  return {
    type: RTS_RESULT,
    data,
    dataUUID,
    field
  };
}

export function rtsError(error, dataUUID) {
  return {
    type: RTS_ERROR,
    error,
    dataUUID
  };
}
