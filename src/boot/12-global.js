import sagas_rts from 'services/rts/sagas'

export default function () {
  this.injectSagas(sagas_rts);
}
