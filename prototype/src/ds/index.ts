import type * as BDSTypes from "./bds-types";

import "./load";

// load.ts runs first (static import), so window.BDS is ready at module load.
export const BDS = (window as unknown as { BDS: typeof BDSTypes }).BDS;
