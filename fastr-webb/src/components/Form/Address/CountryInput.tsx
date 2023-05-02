import React, {useState, useEffect} from "react";
import {CountrySettings} from "../../../model/CountrySettings";
import ClientService from "../../../service/ClientService";
import {withFormsy} from "formsy-react";
import {Typeahead} from "react-bootstrap-typeahead";
import {PassDownProps} from "formsy-react/dist/Wrapper";
import {NotificationManager} from "react-notifications";
import {translate} from "../../Intl/IntlGlobalProvider";

type PropType = PassDownProps
interface Props extends PropType {
    name: string,
    getChosenCountry: (countryCode: string) => void
}

const CountryInput = (props) => {
    const clientService             = new ClientService();
    const [countries, setCountries] = useState<Array<CountrySettings>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [valid, setValid]         = useState(false);

    useEffect(() => {
        fetchCountries()
    }, [])

    const fetchCountries = async () => {
        setIsLoading(true);
        try {
            const fetchedCountries: CountrySettings[] = await clientService.getCountries();
            setCountries(fetchedCountries);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            NotificationManager.error(translate.formatMessage({id: "Service indisponible, veuillez retourner à la liste des actions afin de réitérer cet acte de gestion."}), null, 5000);
            console.error(error)
            setCountries([]);
        }
    }

    const onCountryChange = (country: CountrySettings[]) => {
        if (country && country.length > 0) {
            setNewCountry(country[0]);
        } else {
            props.resetValue();
            setValid(false);
            props.getChosenCountry("")
        }
    }

    const setNewCountry = (country: CountrySettings) => {
        const isoCodeNum = country.isoCodeNum < 100 ? `0${country.isoCodeNum}` : country.isoCodeNum.toString();
        props.setValue(isoCodeNum);
        setValid(true);
        props.getChosenCountry(isoCodeNum)
    }

    const onBlur = (event) => {
        if (event.target && event.target.value) {
            const countryMatchingInput = countries.find(country => country.name === event.target.value.toUpperCase());
            if (countryMatchingInput) {
                setNewCountry(countryMatchingInput);
            } else {
                setValid(false);
            }
        }
    };

    return (
        <Typeahead
            emptyLabel={isLoading ? 'Chargement en cours...' : 'Aucun résultat trouvé !'}
            isValid={valid}
            isInvalid={!valid}
            labelKey="name"
            onBlur={onBlur}
            onChange={onCountryChange}
            options={countries}
            {...props}
        />
    )
}

export default withFormsy<Props>(CountryInput);