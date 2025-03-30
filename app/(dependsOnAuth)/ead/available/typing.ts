import { ApiModule } from "@/app/(api)/api/moodle/GetAvailableModules/route";

export type ModuleExt = ApiModule & { course: string };
export type AvailableModulesExt = {
  modules: {
    current: Record<number, ModuleExt[]>;
    future: Record<number, ModuleExt[]>;
    past: Record<number, ModuleExt[]>;
  };
};
