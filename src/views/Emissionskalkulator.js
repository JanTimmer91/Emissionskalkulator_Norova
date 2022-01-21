import React, {Component, Fragment} from 'react';
import styled from 'styled-components';
import {Button, Col, FormCheck, Image, Row, Table} from 'react-bootstrap';
import axios from "axios";
import Select from 'react-select';
import treeImage from './treeImage.png'
import info_icon from './info_icon.svg.png'

const BigHeader = styled.div`
    margin: 26px 0px 0px 42px;
    font-weight: 300;
    font-size: 22px;
    display:inline-block;
`;

const MidHeader = styled.div`
    margin: 26px 0px 8px 26px;
    font-weight: 300;
    font-size: 20px;
    display:inline-block;
`;

const DropDownContainer = styled.div`

`;

const DropDownList = styled.div`

    background-color: white;
    z-index: +1;
    position: absolute;
    width: 255px;
    margin-bottom: 20px;
`;

const DropDownListItem = styled.div`

    padding-left: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 74%;
    transition: all .25s ease-in-out 0s;
    border: 0.2px solid lightgrey;
    margin-bottom: -1px;

    :hover {
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .2);
    transform: translate(0, -1px);
    background-color: lightblue;
    cursor: pointer;
    font-weight: 700;
    }
    
`;

const InputContainer = styled.div`
    z-index: -1;
    border: solid lightgrey 0.5px;
    border-radius: 10px;
    background-color: white;
    padding: 16px 16px 16px 16px;
    margin: 15px 0px 0px 0px;
    :hover {
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .2);
        cursor: pointer;
    }
`;

const InputFieldContainer = styled.div`
    z-index: -1;
    border: solid lightgrey 0.5px;
    border-radius: 10px;
    background-color: white;
    padding: 32px 16px 32px 16px;
    margin: 15px 0px 0px 25px;
    :hover {
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .2);
        cursor: pointer;
    }
`;

const CurrencySelectionContainer = styled.div`
    z-index: -1;
    border: solid lightgrey 0.5px;
    border-radius: 10px;
    background-color: white;
    padding: 16px 16px 16px 16px;
    margin: 15px 0px 0px 0px;
    :hover {
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .2);
        cursor: pointer;
    }
`;

const SendButtonContainer = styled.div`
    z-index: -1;
    border: solid lightgrey 0.5px;
    border-radius: 10px;
    background-color: white;
    padding: 16px 16px 16px 16px;
    margin: 15px 0px 0px 25px;
    :hover {
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .2);
        cursor: pointer;
    }
`;

const CalculationButtonContainer = styled.div`
    z-index: -1;
    border: solid lightgrey 0.5px;
    border-radius: 10px;
    background-color: white;
    padding: 16px 16px 16px 16px;
    margin: 15px 0px 0px 0px;
    :hover {
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .2);
        cursor: pointer;
    }
`;

const CalculationResultContainer = styled.div`
    z-index: -1;
    border: solid lightgrey 0.5px;
    border-radius: 10px;
    background-color: white;
    padding: 16px 16px 16px 16px;
    margin: 15px 0px 0px 0px;
    :hover {
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .2);
        transform: translate(0, -1px);
        cursor: pointer;
        font-weight: 500;
    }
`;

const StepContainer = styled.div`
    z-index: -1;
    border-bottom: solid lightgrey 0.5px;
    border-radius: 10px;
    background-color: white;
    padding: 16px 16px 16px 16px;
    margin: 15px 0px 0px 0px;
    color: grey;
    font-weight: 600;
`;

class Emissionskalkulator extends Component {

    constructor(props) {
        super(props);

        this.state = {
            EmissionPerKwhInGramCO2020: 336,
            dieselTankToWheel2019: 128,
            petrolTankToWheel2019: 140,
            gasTankToWheel2019: 126,
            bioDieselTankToWheel2019: 133,
            greyEmissionsForCarGasInGramPerKm: 15,
            greyEmissionsForBiodieselInGramPerKm: -50,
            greyEmissionsForPetrolAndDieselInGramPerKm: 24,

            years: [],
            selectedYear: undefined,
            retrievedMakesForYears: [],
            selectedMake: '',
            retrievedModelsForMakes: [],
            selectedModel: '',
            retrievedModelOptionsForMakes: [],
            selectedModelOption: '',
            selectedEmissionForModelOption: '',
            selectedZugType: '',
            selectedBusType: '',
            selectedFlugzeugType: '',
            //Treibhausgas-Emissionen in Gramm pro Personenkilometer
            //Entnommen aus theoretischer Ausarbeitung des CO2-Kalkulators für Norova
            Flugzeug: [
                {label: "Flugzeug (Inland)", value: 284},
            ],

            Bus: [
                {label: "Linienbus (Nahverkehr)", value: 111},
                {label: "Linienbus (Fernverkehr)", value: 27},
                {label: "Reisebus (Gruppenfahrt, Tagesfahrt, Rundreise)", value: 284}
            ],

            Zug: [
                {label: "Eisenbahn (Nahverkehr)", value: 86},
                {label: "Eisenbahn (Fernverkehr)", value: 50},
                {label: "Bahn (Straßenbahn, Stadtbahn, U-Bahn)", value: 75}
            ],

            norovaVerkehrsmittelKm: {"Rad": 10, "Bus": 20, "Auto": 30, "Zug": 120, "Gehen": 1},
            distanceSum: 0,
            emissionSum: 0,
            greyEmissionSum: 0,

            selectedEmissions: {},
            selectedGreyEmissions: {},

            canShowEmissionSum: false,
            hideCarConfigurator: false,
            isElectricCar: false,
            dontKnowMyCar: false,
            hideMyElectricCarHasNoEmissions: false,
            dontKnowMyCar_carIsElectric: false,
            dontKnowMyCar_carIsWithCombustion: false,
            showCheckCarType: false,
            unknownElectricCarConsumption: 0,
            selectedFuel: '',
            bicycleisElectric: false,
            electricBicycleConsumption: 0,
            showBicycleCheckbox: true,
            autoGesetzt: false,
            radGesetzt: false,
            zugGesetzt: false,
            busGesetzt: false,

        };
    }

    componentDidMount() {
        document.body.style.backgroundColor = "rgba(203,203,210,.15)"
        axios.get('https://www.fueleconomy.gov/ws/rest/vehicle/menu/year')
            .then(response => response.data)
            .then(data => {
                this.setState({years: this.getYears(data["menuItem"])})
            });
        this.setState({distanceSum: this.calculateDistanceSum()})
        this.setState({selectedEmissions: this.buildEmissionsTemplate()})
        this.setState({selectedGreyEmissions: this.buildGreyEmissionsTemplate()})

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedYear !== this.state.selectedYear) {
            axios.get('https://www.fueleconomy.gov/ws/rest/vehicle/menu/make', {params: {"year": this.state.selectedYear.value}})
                .then(response => response.data)
                .then(data => {
                    let makesForOptions = []
                    for (let i = 0; i < data["menuItem"].length; i++) {
                        makesForOptions.push({value: data["menuItem"][i].value, label: data["menuItem"][i].value})
                    }
                    this.setState({retrievedMakesForYears: makesForOptions});
                })
        }

        if (prevState.selectedMake !== this.state.selectedMake) {
            axios.get('https://www.fueleconomy.gov/ws/rest/vehicle/menu/model', {
                params: {
                    "year": this.state.selectedYear.value,
                    "make": this.state.selectedMake.value
                }
            })
                .then(response => response.data)
                .then(data => {
                    let modelsForOptions = []
                    for (let i = 0; i < data["menuItem"].length; i++) {
                        modelsForOptions.push({value: data["menuItem"][i].value, label: data["menuItem"][i].value})
                    }
                    this.setState({retrievedModelsForMakes: modelsForOptions});
                })
        }
        if (prevState.selectedModel !== this.state.selectedModel) {
            axios.get('https://www.fueleconomy.gov/ws/rest/vehicle/menu/options', {
                params: {
                    "year": this.state.selectedYear.value,
                    "make": this.state.selectedMake.value,
                    "model": this.state.selectedModel.value
                }
            })
                .then(response => response.data)
                .then(data => {
                    let modelOptionsForMakes = []
                    if (data["menuItem"].length != undefined) {
                        for (let i = 0; i < data["menuItem"].length; i++) {
                            modelOptionsForMakes.push({
                                value: data["menuItem"][i].value,
                                label: data["menuItem"][i].text
                            })
                        }
                    } else {
                        modelOptionsForMakes.push({value: data["menuItem"].value, label: data["menuItem"].text})
                    }
                    this.setState({retrievedModelOptionsForMakes: modelOptionsForMakes});
                })
        }
        if (prevState.selectedModelOption !== this.state.selectedModelOption) {
            axios.get('https://www.fueleconomy.gov/ws/rest/vehicle/' + this.state.selectedModelOption.value
            )
                .then(response => response.data)
                .then(data => {
                    if (data["co2TailpipeGpm"] !== 0.0) {
                        console.log("Is not an electric car")
                        this.calculateEmissionsForCarWithCombustion(data)
                    } else if (data["combE"] !== 0.0) {
                        console.log("Is an electric car")
                        this.calculateGreyEmissionsForElectricCar(data)
                    }
                })
        }

        if (prevState.autoGesetzt !== this.state.autoGesetzt || prevState.busGesetzt !== this.state.busGesetzt || prevState.zugGesetzt !== this.state.zugGesetzt) {

            if (this.state.autoGesetzt && this.state.busGesetzt && this.state.zugGesetzt) {
                this.setState({canShowEmissionSum: true})
            }
        }
    }

    handleYearChange = (selectedYear) => {
        this.setState({selectedYear});
    };

    handleMakeChange = (selectedMake) => {
        this.setState({selectedMake});
    };

    handleModelChange = (selectedModel) => {
        this.setState({selectedModel});
    };

    handleModelOptionChange = (selectedModelOption) => {
        this.setState({selectedModelOption: selectedModelOption});
    };

    calculateZugEmissions = (selectedZugType) => {
        this.setState({selectedZugType: selectedZugType});
        let updatedSelectedGreyEmissions = this.state.selectedGreyEmissions
        updatedSelectedGreyEmissions["Zug"] = selectedZugType.value * this.state.norovaVerkehrsmittelKm["Zug"]
        this.setState({selectedGreyEmissions: updatedSelectedGreyEmissions})
        this.updateGreyEmissionSum()
        this.setState({zugGesetzt: true})
    };

    calculateBusEmissions = (selectedBusType) => {
        this.calculateGreyEmissionsForCombustionVehicles("Bus")

        this.setState({selectedBusType: selectedBusType});
        let updatedSelectedEmissions = this.state.selectedEmissions
        updatedSelectedEmissions["Bus"] = selectedBusType.value * this.state.norovaVerkehrsmittelKm["Bus"]
        this.setState({selectedEmissions: updatedSelectedEmissions})
        this.updateEmissionSum()

        this.setState({busGesetzt: true})

    };

    calculateEmissionsForCarWithCombustion = (data) => {
        //Miles to Kilometer
        let emissionsInGramPerKm = (data["co2TailpipeGpm"] / 1.609344).toFixed(2)
        this.setState({selectedEmissionForModelOption: emissionsInGramPerKm});
        let updatedSelectedEmissions = this.state.selectedEmissions
        updatedSelectedEmissions["Auto"] = parseFloat((emissionsInGramPerKm * this.state.norovaVerkehrsmittelKm["Auto"]).toFixed(2))
        this.setState({selectedEmissions: updatedSelectedEmissions})
        this.updateEmissionSum()

        this.calculateGreyEmissionsForCombustionVehicles("Auto")

        this.setState({autoGesetzt: true})
    };

    calculateGreyEmissionsForElectricCar = (data) => {
        this.setState({carIsElectric: true})

        let consumptionInKWHPer100Miles = data["combE"]
        let EmissionPerKwhInGramCO2020 = 336
        let consumptionPerKWHPerKM = consumptionInKWHPer100Miles / 160.934 * this.state.norovaVerkehrsmittelKm["Auto"]
        let emissionsInGramPerKm = consumptionPerKWHPerKM * EmissionPerKwhInGramCO2020
        this.setState({selectedEmissionForModelOption: emissionsInGramPerKm});


        //set grey emissions
        let updatedSelectedGreyEmissions = this.state.selectedGreyEmissions
        updatedSelectedGreyEmissions["Auto"] = parseFloat((emissionsInGramPerKm).toFixed(2))
        this.setState({selectedGreyEmissions: updatedSelectedGreyEmissions})
        this.updateGreyEmissionSum()

        this.setState({autoGesetzt: true})
    };

    handleFuelChange = (selectedFuel) => {
        this.setState({selectedFuel});
    };

    getYears(yearsRaw) {
        let years = []
        for (let i = 0; i < yearsRaw.length; i++) {
            years.push({value: yearsRaw[i].value, label: yearsRaw[i].value})
        }
        return years
    }

    updateEmissionSum = () => {
        let sum = 0;
        for (var key in this.state.selectedEmissions) {
            sum += this.state.selectedEmissions[key];
        }
        this.setState({emissionSum: sum})
    };

    updateGreyEmissionSum = () => {
        let sum = 0;
        for (var key in this.state.selectedGreyEmissions) {
            sum += this.state.selectedGreyEmissions[key];
        }
        this.setState({greyEmissionSum: sum})
    };

    calculateDistanceSum = () => {
        let sum = 0;
        for (var key in this.state.norovaVerkehrsmittelKm) {
            sum += this.state.norovaVerkehrsmittelKm[key];
        }
        return sum;
    };

    buildEmissionsTemplate = () => {
        let emissions = {};
        for (var key in this.state.norovaVerkehrsmittelKm) {
            emissions[key] = 0;
        }
        return emissions;
    }

    buildGreyEmissionsTemplate = () => {
        let greyEmissions = {};
        for (var key in this.state.norovaVerkehrsmittelKm) {
            greyEmissions[key] = 0;
        }
        return greyEmissions;
    }

    carNotKnown = () => {
        /*
        this.setState({selectedEmissionForModelOption: 152});
        let updatedSelectedEmissions = this.state.selectedEmissions
        updatedSelectedEmissions["Auto"] = parseFloat((152 * this.state.norovaVerkehrsmittelKm["Auto"]).toFixed(2))
        this.setState({selectedEmissions: updatedSelectedEmissions})
        this.updateEmissionSum()
         */
        this.setState({hideCarConfigurator: true})
        this.setState({hideMyElectricCarHasNoEmissions: true})
        this.setState({dontKnowMyCar: true})
        this.setState({showCheckCarType: true})

    }

    setElectricCarNoEmissions = () => {
        this.setState({isElectricCar: true})
        this.setState({selectedEmissionForModelOption: 0});
        let updatedSelectedEmissions = this.state.selectedEmissions
        updatedSelectedEmissions["Auto"] = parseFloat((0 * this.state.norovaVerkehrsmittelKm["Auto"]).toFixed(2))
        this.setState({selectedEmissions: updatedSelectedEmissions})
        this.updateEmissionSum()
        this.setState({hideCarConfigurator: true})
        this.setState({dontKnowMyCar: true})

        this.setState({autoGesetzt: true})
    }

    dontKnowMyCar_carIsElectric = () => {
        this.setState({dontKnowMyCar_carIsElectric: true})
        this.setState({showCheckCarType: false})
    }

    dontKnowMyCar_carIsWithCombustion = () => {
        this.setState({dontKnowMyCar_carIsWithCombustion: true})
        this.setState({showCheckCarType: false})
    }

    bicycleIsElectric = () => {
        this.setState({bicycleIsElectric: true})
        this.setState({showElectricBikeConsumptionInput: true})
        this.setState({showBicycleCheckbox: false})
    }

    calculate_emissiondata_dontKnowMyCar_carIsWithCombustion = () => {
        let emissionsInGramPerKm = 0;
        if (this.state.selectedFuel.value == "Benzin") {
            emissionsInGramPerKm = this.state.petrolTankToWheel2019
        } else if (this.state.selectedFuel.value == "Diesel") {
            emissionsInGramPerKm = this.state.dieselTankToWheel2019
        } else if (this.state.selectedFuel.value == "Autogas") {
            emissionsInGramPerKm = this.state.gasTankToWheel2019
        } else if (this.state.selectedFuel.value == "Biodiesel") {
            emissionsInGramPerKm = this.state.bioDieselTankToWheel2019
        }
        this.setState({selectedEmissionForModelOption: emissionsInGramPerKm});
        let updatedSelectedEmissions = this.state.selectedEmissions
        updatedSelectedEmissions["Auto"] = parseFloat((emissionsInGramPerKm * this.state.norovaVerkehrsmittelKm["Auto"]).toFixed(2))
        this.setState({selectedEmissions: updatedSelectedEmissions})
        this.updateEmissionSum()

        this.calculateGreyEmissionsForCombustionVehicles("Auto", this.state.selectedFuel.value)

        this.setState({autoGesetzt: true})

    }

    calculate_emissiondata_dontKnowMyCar_carIsElectric = () => {
        let consumptionInKWHPer100km = this.state.unknownElectricCarConsumption
        let EmissionPerKwhInGramCO2020 = this.state.EmissionPerKwhInGramCO2020
        let consumptionPerKWHPerKM = consumptionInKWHPer100km / 100 * this.state.norovaVerkehrsmittelKm["Auto"]
        let emissionsInGramPerKm = consumptionPerKWHPerKM * EmissionPerKwhInGramCO2020
        this.setState({selectedEmissionForModelOption: emissionsInGramPerKm});
        let updatedGreySelectedEmissions = this.state.selectedGreyEmissions
        updatedGreySelectedEmissions["Auto"] = parseFloat((emissionsInGramPerKm).toFixed(2))
        this.setState({selectedGreyEmissions: updatedGreySelectedEmissions})
        this.updateGreyEmissionSum()

        this.setState({autoGesetzt: true})
    }


    calculateGreyEmissionsForEBicycle = () => {
        let consumptionInKWHPer100km = this.state.electricBicycleConsumption
        let EmissionPerKwhInGramCO2020 = this.state.EmissionPerKwhInGramCO2020
        let consumptionPerKWHPerKM = consumptionInKWHPer100km / 100 * this.state.norovaVerkehrsmittelKm["Rad"]
        let emissionsInGramPerKm = consumptionPerKWHPerKM * EmissionPerKwhInGramCO2020
        this.setState({selectedEmissionForModelOption: emissionsInGramPerKm});
        let updatedSelectedGreyEmissions = this.state.selectedGreyEmissions
        updatedSelectedGreyEmissions["Rad"] = parseFloat((emissionsInGramPerKm).toFixed(2))
        this.setState({selectedGreyEmissions: updatedSelectedGreyEmissions})
        this.updateGreyEmissionSum()

        this.setState({radGesetzt: true})

    }

    calculateGreyEmissionsForCombustionVehicles = (vehicle, fuelType) => {
        //update grey emissions
        //Wheel to tank: 24g/km
        let greyEmissionsInGramPerKm = 0;
        if (fuelType === "Autogas") {
            greyEmissionsInGramPerKm = this.state.greyEmissionsForCarGasInGramPerKm
        } else if (fuelType === "Biodiesel") {
            greyEmissionsInGramPerKm = this.state.greyEmissionsForBiodieselInGramPerKm
        } else {
            //car is powered by diesel or petrol
            greyEmissionsInGramPerKm = this.state.greyEmissionsForPetrolAndDieselInGramPerKm
        }
        let updatedSelectedGreyEmissions = this.state.selectedGreyEmissions
        updatedSelectedGreyEmissions[vehicle] = parseFloat((greyEmissionsInGramPerKm * this.state.norovaVerkehrsmittelKm[vehicle]).toFixed(2))
        this.setState({selectedGreyEmissions: updatedSelectedGreyEmissions})
        this.updateGreyEmissionSum()
    }

    render() {
        return (
            <>
                <BigHeader><i><b>Emissionskalkulator für meine Strecke</b></i></BigHeader>
                <a style={{marginLeft: "12px", marginBottom: "12px"}}>
                    <Image height={"20px"} onClickwidth={"20px"} src={info_icon} alt="infoImage"/> = Datengrundlage
                </a>
                <br/>
                <StepContainer>
                    <MidHeader><i>Erfasste Daten</i></MidHeader>
                    <br/>
                    <Table striped hover>
                        <thead>
                        <tr>
                            <th></th>
                            {
                                Object.keys(this.state.norovaVerkehrsmittelKm).map((key, value) =>
                                    key == "Bus" && this.state.busGesetzt == false
                                    || key == "Auto" && this.state.autoGesetzt == false
                                    || key == "Zug" && this.state.zugGesetzt == false
                                        ? <th>{key} (nicht gesetzt)</th> : <th>{key}</th>
                                )
                            }
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Gefahrene Distanz</td>
                            {
                                Object.keys(this.state.norovaVerkehrsmittelKm).map((key, value) =>
                                    <td>{this.state.norovaVerkehrsmittelKm[key]} km</td>
                                )
                            }
                        </tr>
                        <tr>
                            <td>Graue Emissionen&nbsp;
                                <a href="https://www.forschungsinformationssystem.de/servlet/is/332825/">
                                    <Image height={"20px"} onClickwidth={"20px"} src={info_icon} alt="treeImage"/>
                                </a>
                            </td>
                            {
                                Object.keys(this.state.norovaVerkehrsmittelKm).map((key, value) =>
                                    <td>{this.state.selectedGreyEmissions[key]} g</td>
                                )
                            }
                        </tr>
                        <tr>
                            <td>Aktive Emissionen
                                <div style={{marginRight: "-60px", display: "inline-block"}}>
                                    &nbsp;
                                    <a href="https://www.fueleconomy.gov/feg/ws/">
                                        <Image height={"20px"} onClickwidth={"20px"} src={info_icon} alt="treeImage"/>
                                    </a>
                                    &nbsp;
                                    <a href="https://www.umweltbundesamt.de/sites/default/files/medien/366/bilder/uba_emissionsgrafik_personenverkehr_2020.jpg">
                                        <Image height={"20px"} onClickwidth={"20px"} src={info_icon} alt="treeImage"/>
                                    </a>
                                    &nbsp;
                                    <a href="https://www.forschungsinformationssystem.de/servlet/is/332825/">
                                        <Image height={"20px"} onClickwidth={"20px"} src={info_icon} alt="treeImage"/>
                                    </a>
                                    &nbsp;
                                    <a href="https://www.oliver-krischer.eu/wp-content/uploads/2020/08/deutsch_Studie-EAuto-versus-Verbrenner_CO2.pdf">
                                        <Image height={"20px"} onClickwidth={"20px"} src={info_icon} alt="treeImage"/>
                                    </a>
                                </div>
                            </td>
                            {
                                Object.keys(this.state.norovaVerkehrsmittelKm).map((key, value) =>
                                    <td>{this.state.selectedEmissions[key]} g</td>
                                )
                            }
                        </tr>
                        <tr>
                            <td>Gesamt:</td>
                            {this.state.canShowEmissionSum == true ?
                                <td>{((this.state.emissionSum + this.state.greyEmissionSum) / 1000).toFixed(2)} kg
                                    / {this.state.distanceSum} km</td>
                                :
                                <td colspan="2"><i>Bitte zuerst alle Details zu den genutzten Verkehrsmitteln setzen</i>
                                </td>
                            }
                        </tr>
                        </tbody>
                    </Table>
                    {
                        this.state.canShowEmissionSum == true ?
                            <>
                                <div>Um diese Strecke auszugleichen, müssten
                                    ca. <b>{(((this.state.emissionSum + this.state.greyEmissionSum) / 1000) / 12.5).toFixed(2)} </b> Buchen
                                    gepflanzt werden!&nbsp;&nbsp;&nbsp;&nbsp;<img style={{borderRadius: "100px"}}
                                                                                  height={"60px"} width={"60px"}
                                                                                  src={treeImage} alt="treeImage"/>
                                </div>

                            </>
                            :
                            null
                    }
                </StepContainer>
                <br/>
                <Row>
                    <Col>
                        <BigHeader>
                            Auswahl Auto
                        </BigHeader>
                        <InputContainer>
                            {this.state.dontKnowMyCar == false ?
                                <Row>
                                    <FormCheck style={{marginLeft: "20px", marginTop: "20px", marginBottom: "20px"}}
                                               onClick={this.carNotKnown} type="checkbox"
                                               label="Ich kenne meine Fahrzeugdaten nicht"/>
                                </Row> : null
                            }
                            {this.state.dontKnowMyCar == true ?
                                <>
                                    {this.state.showCheckCarType == true ?
                                        <>
                                            <div>Mein Fahrzeug ist ein:</div>
                                            <Row>
                                                <FormCheck
                                                    style={{
                                                        marginLeft: "20px",
                                                        marginTop: "20px",
                                                        marginBottom: "20px"
                                                    }}
                                                    onClick={this.dontKnowMyCar_carIsElectric}
                                                    type="checkbox"
                                                    label="E-Auto"/>
                                            </Row>
                                            <Row>
                                                <FormCheck style={{
                                                    marginLeft: "20px",
                                                    marginTop: "20px",
                                                    marginBottom: "20px"
                                                }}
                                                           onClick={this.dontKnowMyCar_carIsWithCombustion}
                                                           type="checkbox"
                                                           label="Auto mit Verbrennungsmotor"/>
                                            </Row>
                                        </>
                                        :
                                        null
                                    }
                                </>
                                : null
                            }
                            {this.state.dontKnowMyCar_carIsElectric == true ?
                                <>
                                    <Row>
                                        <Col lg={1}>
                                            <StepContainer>Verbrauch (kWh/100 km)</StepContainer>
                                        </Col>
                                        <Col lg={3}>
                                            <InputFieldContainer>
                                                <input
                                                    type='number'
                                                    onChange={(event) => this.setState({unknownElectricCarConsumption: event.target.value})}
                                                />
                                            </InputFieldContainer>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button style={{marginLeft: "10px", marginTop: "20px"}}
                                                    onClick={this.calculate_emissiondata_dontKnowMyCar_carIsElectric}>Setzen</Button>
                                        </Col>
                                    </Row>
                                </>
                                : null
                            }
                            {this.state.dontKnowMyCar_carIsWithCombustion == true ?
                                <>
                                    <Row>
                                        <Col lg={1}>
                                            <StepContainer>Kraftstoff</StepContainer>
                                        </Col>
                                        <Col lg={3}>
                                            <InputFieldContainer>
                                                <Select
                                                    value={this.state.selectedFuel}
                                                    onChange={this.handleFuelChange}
                                                    options={[{label: "Diesel", value: "Diesel"}
                                                        , {label: "Benzin", value: "Benzin"}
                                                        , {label: "Autogas", value: "Autogas"}
                                                        , {label: "Biodiesel", value: "Biodiesel"}
                                                    ]}
                                                />
                                            </InputFieldContainer>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button style={{marginLeft: "10px", marginTop: "20px"}}
                                                    onClick={this.calculate_emissiondata_dontKnowMyCar_carIsWithCombustion}>Setzen</Button>
                                        </Col>
                                    </Row>
                                </>
                                : null
                            }
                            {this.state.hideMyElectricCarHasNoEmissions == false ?
                                <Row>
                                    <FormCheck style={{marginLeft: "20px", marginTop: "20px", marginBottom: "20px"}}
                                               onClick={this.setElectricCarNoEmissions} type="checkbox"
                                               label="Ich habe ein E-Auto, das mit grünem Strom fährt"/>
                                </Row> : null
                            }
                            {this.state.hideCarConfigurator == false ?
                                <>
                                    <Row>
                                        <Col lg={1}>
                                            <StepContainer>
                                                Prod.jahr
                                            </StepContainer>
                                        </Col>
                                        <Col lg={3}>
                                            <InputFieldContainer>
                                                <Select
                                                    value={this.state.selectedYear}
                                                    onChange={this.handleYearChange}
                                                    options={this.state.years}
                                                />
                                            </InputFieldContainer>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={1}>
                                            <StepContainer>Hersteller</StepContainer>
                                        </Col>
                                        <Col lg={3}>
                                            <InputFieldContainer>
                                                <Select
                                                    value={this.state.selectedMake}
                                                    onChange={this.handleMakeChange}
                                                    options={this.state.retrievedMakesForYears}
                                                />
                                            </InputFieldContainer>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={1}>
                                            <StepContainer>Modell</StepContainer>
                                        </Col>
                                        <Col lg={3}>
                                            <InputFieldContainer>
                                                <Select
                                                    value={this.state.selectedModel}
                                                    onChange={this.handleModelChange}
                                                    options={this.state.retrievedModelsForMakes}
                                                />
                                            </InputFieldContainer>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={1}>
                                            <StepContainer>Ausführung</StepContainer>
                                        </Col>
                                        <Col lg={3}>
                                            <InputFieldContainer>
                                                <Select
                                                    value={this.state.selectedModelOption}
                                                    onChange={this.handleModelOptionChange}
                                                    options={this.state.retrievedModelOptionsForMakes}
                                                />
                                            </InputFieldContainer>
                                        </Col>
                                    </Row>
                                </>
                                : null
                            }
                            {/*
                                <Row>
                                    <Col lg={1}>
                                        <StepContainer>Fahrzeug setzen</StepContainer>
                                    </Col>
                                    <Col lg={3}>
                                        <SendButtonContainer>
                                            <Button onClick={this.setCar}>Setzen</Button>
                                        </SendButtonContainer>
                                    </Col>
                                </Row>
                            */}
                        </InputContainer>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <BigHeader>Auswahl sonstiger Verkehrsmittel
                        </BigHeader>
                        <InputContainer>
                            {Object.keys(this.state.norovaVerkehrsmittelKm).map((key, value) =>
                                key === "Gehen" || key === "Auto" ?
                                    null
                                    :
                                    key === "Rad" ?
                                        <>
                                            {this.state.showBicycleCheckbox == true ?
                                                <Row>
                                                    <Col lg={1}>
                                                        <StepContainer>Rad</StepContainer>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <InputFieldContainer>
                                                            <FormCheck style={{
                                                                marginLeft: "20px",
                                                                marginTop: "20px",
                                                                marginBottom: "20px"
                                                            }}
                                                                       onClick={this.bicycleIsElectric} type="checkbox"
                                                                       label="Rad hat Elektroantrieb"/>
                                                        </InputFieldContainer>
                                                    </Col>
                                                </Row>
                                                : null
                                            }
                                            {
                                                this.state.showElectricBikeConsumptionInput ?
                                                    <>
                                                        <Row>
                                                            <Col lg={1}>
                                                                <StepContainer>E-Rad Verbrauch (kWh/100
                                                                    km)</StepContainer>
                                                            </Col>
                                                            <Col lg={3}>
                                                                <InputFieldContainer>
                                                                    <input
                                                                        type='number'
                                                                        onChange={(event) => this.setState({electricBicycleConsumption: event.target.value})}
                                                                    />
                                                                    <Button style={{marginLeft: "10px"}}
                                                                            onClick={this.calculateGreyEmissionsForEBicycle}>Setzen</Button>

                                                                </InputFieldContainer>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                    :
                                                    null
                                            }</>
                                        :
                                        <Row>
                                            <Col lg={1}>
                                                <StepContainer>{key}</StepContainer>
                                            </Col>
                                            <Col lg={3}>
                                                <InputFieldContainer>
                                                    <Select
                                                        value={this.state["selected" + key + "Type"]}
                                                        onChange={this["calculate" + key + "Emissions"]}
                                                        options={this.state[key]}
                                                    />
                                                </InputFieldContainer>
                                            </Col>
                                        </Row>
                            )}
                        </InputContainer>
                    </Col>
                </Row>
                {/*
                <Row>
                    <Col>
                        <CalculationButtonContainer>
                        <Button onClick={this.setCar}>Emissionen jetzt berechnen!</Button>
                        </CalculationButtonContainer>
                    </Col>
                </Row>
                */}
            </>
        );
    }
}

export default Emissionskalkulator;
