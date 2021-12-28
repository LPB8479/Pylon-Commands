import { config } from '../config/config';
export async function modlogCount(key: any, by: number = 1): Promise<number> {
    const nextValue = await config.kv.modlog.transact<number>(
        key,
        (prevValue = 0) => {
            return prevValue + by;
        }
    );
    return nextValue!;
}