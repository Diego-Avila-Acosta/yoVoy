import React, { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
	getCategories,
	getLocations,
} from '../../redux/actions/actions-Create';
import { AppDispatch, State } from '../../redux/store/store';
import { Category, Location } from '../../types';
import DatesModal from './CreateEventModal/DatesModal';
import { useCreateEvent } from './useCreateEvent';
import { useDatesModal } from './CreateEventModal/useDatesModal';
import { useCreateEventMutation } from '../../slices/app/eventsApiSlice';
import styleCreateEvent from './create-event.module.css';
import { FiEdit } from 'react-icons/fi';
import styleUpdate from "../UpdateEvent/update-event.module.css"

const CreateEvent = () => {

	type Input = React.ChangeEvent<HTMLInputElement>
	const locSelect = useRef<any>()
	const [isOpen, openModal, closeModal] = useDatesModal(false);
	const [createEvent] = useCreateEventMutation();
	const dispatch: AppDispatch = useDispatch();

	const locations: Array<Location> = useSelector(
		(state: State) => state.global.locations,
	);
	const categories: Array<Category> = useSelector(
		(state: State) => state.global.categories,
	);
	const [datesToDelete, setDatesToDelete] = useState<any>([])
	const [forDeleteONot, setForDeleteONot] = useState<any>("dontDelete")
	
	useEffect(() => {
		dispatch(getLocations());
		dispatch(getCategories());
	}, [dispatch]);

	const [
		input,
		resetState,
		handleInputChange,
		handleInputDateChange,
		currentDate,
		currentLocId,
		locsAux,
		isAlreadyAdded,
		handleAddDate,
		handleCategoryChange,
		handleLocationChange,
		handleConfirm,
		locsForSubmit,
		handleRemoveLoc,
		handleUpdateFetch,
		removeDateFromLocsAux,
		setCurrentLocId,
		resetDateForm
	] = useCreateEvent({ locations });

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const event = {
			...input,
			locations: locsForSubmit,
		}
		try {
			if (err.nameErr === "" &&
				err.descriptionErr === "" &&
				err.categoriesErr === "" &&
				err.locationsErr === "" &&
				err.imgErr === "") {
				await createEvent({ newEvent: event });
				resetState();
			} else {
				alert("Debe completar todos los campos correctamente para poder crear un perro")
			}
		} catch (error) {
			console.log(error);
		}
	};


	const [err, setErr] = useState({
		nameErr: "",
		descriptionErr: "",
		categoriesErr: "Debe tener al menos 1 categoria",
		locationsErr: "Debe tener al menos 1 locación",
		imgErr: "",
	})

	const [datesErr, setdatesErr] = useState({
		priceErr: "",
		locationDateErr: "",
		dateInputErr: "",
	})

	useEffect(() => {
		if (input.name.length < 4) {
			setErr({ ...err, nameErr: "Debe tener entre 4 a 50 caracteres" })
		}
		if (input.name.length > 3) {
			setErr({ ...err, nameErr: "" })
		}
	}, [input.name])

	useEffect(() => {
		if (input.description.length < 50) {
			setErr({ ...err, descriptionErr: "Debe tener entre 50 a 250 caracteres" })
		}
		if (input.description.length > 49) {
			setErr({ ...err, descriptionErr: "" })
		}
	}, [input.description])

	useEffect(() => {
		if (input.categories.length === 0) {
			setErr({ ...err, categoriesErr: "Debe tener al menos 1 categoria" })
		}
		if (input.categories.length > 0) {
			setErr({ ...err, categoriesErr: "" })
		}
	}, [input.categories])

	useEffect(() => {
		console.log(locsForSubmit.length)
		if (locsForSubmit.length === 0) {
			setErr({ ...err, locationsErr: "Debe tener al menos 1 locación" })
		}
		if (locsForSubmit.length > 0) {
			setErr({ ...err, locationsErr: "" })
		}
	}, [locsForSubmit])

	useEffect(() => {
		if (input.background_image === "") {
			setErr({ ...err, imgErr: "Este campo debe esta completo." })
		} else if (input.background_image !== "") {
			if (!(/\.(jpg|png|gif)$/i).test(input.background_image)) {
				setErr({ ...err, imgErr: "Url no contiene un archivo valido" })
			} else {
				setErr({ ...err, imgErr: "" })
			}

		}
	}, [input.background_image])

	useEffect(() => {
		console.log(currentDate.price)
		if (currentDate.price === (NaN || 0)) {
			setdatesErr({ ...datesErr, priceErr: "Debe ingresar un precio" })
		} else if (currentDate.price > 0) {
			setdatesErr({ ...datesErr, priceErr: "" })
		}
	}, [currentDate.price])


	useEffect(() => {
		if (currentLocId === "default") {
			setdatesErr({ ...datesErr, locationDateErr: "Debe selecionar una locacion" })
		} else if (currentLocId !== "default") {
			setdatesErr({ ...datesErr, locationDateErr: "" })
		}
	}, [currentLocId])

	useEffect(() => {
		if (!currentDate.date) {
			setdatesErr({ ...datesErr, dateInputErr: "Debe selecionar una fecha" })
		} else {
			setdatesErr({ ...datesErr, dateInputErr: "" })
		}
	}, [currentDate.date])

	useEffect(() => {
		console.log("Loas que se van a eliminar: ", datesToDelete)
	}, [datesToDelete])

	const handleConfirmClick = (e: any, datesToDelete: any) => {
		let select = locSelect.current
		select.value = 'default';
		// if(locsAux[currentLocId]?.dates?.length===0 || !locsAux[currentLocId]?.dates){
		//      alert("No hay ninguna fecha para agregar")
		// }else{
		// 	handleConfirm(e, datesErr)
		// 	closeModal();
		// };	
		handleConfirm(e, datesToDelete);
		closeModal();
		setDatesToDelete([])
	}

	const handleDeleteClick = (id: any) => {
		if (!datesToDelete.includes(id)) {
			setDatesToDelete([...datesToDelete, id])
		} else {
			setDatesToDelete(datesToDelete.filter((i: any) => i !== id))
		}

	}

	return (
		<React.Fragment>
			<form onSubmit={handleSubmit}>
				<div className={styleCreateEvent.form_order}>
					<fieldset className={styleCreateEvent.fieldset_form}>
						{/* <label htmlFor="name">Nombre del evento:</label> */}
						<legend className={styleCreateEvent.legend_form}>
							Nombre del evento:
						</legend>
						<input
							name="name"
							type="text"
							id="name"
							placeholder="Nombre del evento"
							className={styleCreateEvent.input_create}
							onChange={handleInputChange}
							value={input.name}
						/>
						<label>{err.nameErr}</label>
					</fieldset>{' '}
					<br />
					<fieldset className={styleCreateEvent.fieldset_form}>
						{/* <label htmlFor="description">Descripcion:</label> */}
						<legend className={styleCreateEvent.legend_form}>
							Descripcion:
						</legend>
						<textarea
							name="description"
							id="description"
							placeholder="Descripcion..."
							className={styleCreateEvent.input_create}
							onChange={handleInputChange}
							value={input.description}
						/>
						<label>{err.descriptionErr}</label>
					</fieldset>{' '}
					<br />
					<fieldset className={styleCreateEvent.fieldset_form}>
						{/* <label htmlFor="background_image">Imagen:</label> */}
						<legend className={styleCreateEvent.legend_form}>Imagen:</legend>
						<input
							name="background_image"
							type="text"
							id="background_image"
							placeholder="Imagen..."
							className={styleCreateEvent.input_create}
							onChange={handleInputChange}
							value={input.background_image}
						/>
						<label>{err.imgErr}</label>
					</fieldset>{' '}
					<br />
					<fieldset className={styleCreateEvent.fieldset_form}>
						<legend className={styleCreateEvent.legend_form}>
							Seleccione las categorias:
						</legend>
						{categories?.map((category: Category) => {
							return (
								<React.Fragment key={category.id}>
									<br />
									<input
										value={category.id}
										type="checkbox"
										onChange={handleCategoryChange}
									/>
									<span>{` ${category.id}  ${category.name}`}.</span>
								</React.Fragment>
							);
						})}
						<br />
						<label>{err.categoriesErr}</label>
					</fieldset>{' '}
					<fieldset className={styleCreateEvent.fieldset_form}>
						<legend className={styleCreateEvent.legend_form}>
							Localidades agregadas:
						</legend>
						{
							locsForSubmit.length > 0
								? locsForSubmit
									.map((loc: any) => {
										let locData = locations.find((location) => location.id === parseInt(loc.id));
										return locData ?
											(
												<div>
													<span>{` ${locData.name} `}</span>
													<span>{` ${locData.address} `}</span>
													{/* <button onClick={(e) => handleRemoveLoc(e,loc.id)}>X</button> */}
													<button
														onClick={() => {
															setCurrentLocId(loc.id)
															openModal()
														}}
														type="button"
														className={styleCreateEvent.text_from}
													>
														<FiEdit />
													</button>
													<ul>
														{loc.dates.map((date: any) => (
															<li key={date.date}>{`$${date.price} || ${date.date}`}</li>
														))}
													</ul>
												</div>
											)
											: null
									})
								: <h1>No hay localidades cargadas para el evento</h1>
						}
						<label>{err.locationsErr}</label>
					</fieldset>{' '}
					<br />
					{/* MODAL */}
					<fieldset className={styleCreateEvent.fieldset_form}>
						<legend className={styleCreateEvent.legend_form}>
							Agrege detalles de el/los eventos
						</legend>
						<button
							onClick={() => openModal()}
							type="button"
							className={styleCreateEvent.text_from}
						>
							+
						</button>
						<DatesModal
							isOpen={isOpen}
							closeModal={closeModal}
							className={styleCreateEvent.form_dates_modal}
						>
							<div className={styleUpdate.container_modal}>
								<select
									name="id"
									ref={locSelect}
									placeholder="Seleccione un lugar"
									className={styleCreateEvent.form_cities}
									onChange={handleLocationChange}
								>
									<option value="default">Seleccione la ciudad...</option>
									{locations?.map((location: Location) => {
										return (
											<option
												key={location.id}
												value={location.id}
												className={`${styleCreateEvent.form_citie} ${isAlreadyAdded(location.id) ? styleCreateEvent.form_citie_loaded : null}`}
												selected={location.id === parseInt(currentLocId)}
											// disabled={isAlreadyAdded(location.id)}
											>
												{`-${location.id}, ${location.address}, ${location.name}, ${location.city['name']}.`}
											</option>
										);
									})}
								</select>
								<label>{datesErr.locationDateErr}</label>
							</div>
							<div className={styleUpdate.container_pricedate}>
								<input
									name="price"
									type="number"
									value={currentDate?.price || ""}
									placeholder="Indique el precio..."
									onChange={handleInputDateChange}
								/>
								<label>{datesErr.priceErr}</label>
								<input type="date" name="date" value={currentDate?.date || ''} onChange={handleInputDateChange} />
								<label>{datesErr.dateInputErr}</label>
								<button type="button" onClick={(e) => { handleAddDate(e, datesErr) }}>
									+
								</button>
							</div>


							<div>
								{locsAux[currentLocId]?.dates?.map((date: any, id: any) => {
									console.log(date)
									return (
										<fieldset className={styleCreateEvent.legend_form}>
											<ul>
												<li key={`${date.price} - ${date.date}`}>
													<React.Fragment>
														<p>{`Precio: ${date.price}`} </p>
														<p>{`Fecha: ${date.date}`} </p>
													</React.Fragment>
												</li>
											</ul>
											<React.Fragment>
												<button className={datesToDelete.includes(id)? styleCreateEvent.yesDelete : styleCreateEvent.dontDelete} type="button" key={id} onClick={(e: SyntheticEvent) => { handleDeleteClick(id) }}>X</button>
											</React.Fragment>
										</fieldset>
									);
								})}
							</div>
							<br />
							<div className={styleUpdate.container_create}>
								<button type="button" onClick={(e) => { handleConfirmClick(e, datesToDelete) }}>Confirmar</button>
								<button onClick={(e) => {
									e.preventDefault();
									setDatesToDelete([])
									resetDateForm();
									closeModal();
								}}>cancelar</button>
							</div>
						</DatesModal>
					</fieldset>{' '}
					{/* EN MODAL */}
					<button type="submit" className={styleCreateEvent.bottom_form}>
						Create
					</button>
					<button onClick={(e) => { e.preventDefault(); console.log(err) }}>VER ERRORES</button>
					<button onClick={(e) => {
						const event = {
							...input,
							locations: locsForSubmit,
						}
						e.preventDefault();
						console.log(event)
					}}>VER EVENTO</button>
				</div>
			</form>
		</React.Fragment>
	);
};

export default CreateEvent;
