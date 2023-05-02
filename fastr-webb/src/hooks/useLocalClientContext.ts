import { useTypedSelector } from "src/components/Store/useTypedSelector";
import { ClientContextSliceState } from "src/store/ClientContextSlice";


export const useLocalClientContext = (clientContext?: ClientContextSliceState) => {

    const clientFromContext = clientContext ? clientContext : useTypedSelector(state => state.store.clientContext);
    const currentClient = useTypedSelector(state => state.store.client.currentClient);
    return [currentClient ?? clientFromContext];

}