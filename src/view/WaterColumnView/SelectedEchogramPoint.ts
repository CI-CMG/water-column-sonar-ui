export default class SelectedEchogramPoint {
    public latitude?: number;
    public longitude?: number;
    public depthMeters?: number;
    public timestamp?: number;
    public dataSlice: number[] = [];
    public sv?: number;
    public storeIndex?: number;
  }
