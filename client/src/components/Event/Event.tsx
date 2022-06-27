import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { clearEventId, getEventId } from '../../redux/actions/actions-Create';
import { AppDispatch, State } from '../../redux/store/store';
import { Dates, Location } from '../../types';
import EventModal from './EventModal';
import { useEventModal } from './useEventModal';
import event_style from './Event.module.css';
import { selectCurrentUser } from '../../slices/authentication/authSlice';
import { BsCartPlus } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import {
	useDeleteEventMutation,
	useAddEventToFavoriteMutation,
} from '../../slices/app/eventsApiSlice';
import Swal from 'sweetalert2';
import { addToCart } from '../../redux/actions/actions-Create';

import {
	useDeleteEventToFavoriteMutation,
	useGetFavoriteQuery,
} from '../../slices/app/usersApiSlice';
import Comments from '../Comments/Comments';
import { Toast } from '../../utils/alerts';

const Event = () => {
	const [isOpenModal, openModal, closeModal] = useEventModal(false);
	const [deleteEvent] = useDeleteEventMutation();
	const [addEventToFavorite] = useAddEventToFavoriteMutation();
	const navigate = useNavigate();
	const dispatch: AppDispatch = useDispatch();
	const currentUser: any = useSelector(selectCurrentUser);
	const eventDetail: any = useSelector(
		(state: State) => state.global.eventDetail,
	);
	const { id }: any = useParams<{ id: string }>();
	const { data, isError, error, isFetching, refetch } = useGetFavoriteQuery(
		id,
		{ refetchOnMountOrArgChange: true },
	);
	const [deleteEventToFavorite] = useDeleteEventToFavoriteMutation();
	const state: any = useSelector((state: State) => state);
	const [isVisible, setIsVisible] = useState('hide');

	const { location }: any = useParams<{ location: string }>();
	const [isFavorites, setIsFavorites] = useState<any>([]);

	useEffect(() => {
		if (currentUser) {
			refetch();
		}
	}, [currentUser]);

	useEffect(() => {
		if (!isFetching) {
			isError ? setIsFavorites([]) : setIsFavorites(data);
		}
	}, [isFetching]);

	useEffect(() => {
		dispatch(getEventId(id));

		return () => {
			dispatch(clearEventId());
		};
	}, [dispatch, id]);

	useEffect(() => {
		setTimeout(() => {
			setIsVisible('hide');
		}, 3000);
	}, [isVisible]);

	const addFavorites = (id: any) => {
		if (isFavorites.length === 0) {
			const addF = addEventToFavorite(id).then((result: any) => {
				if (result.error) {
					if (result.error.data.includes('llave duplicada')) {
					} else if (result.error.data.includes('You need a valid token')) {
						Toast.fire({
							title: 'Debe iniciar sesion para poder agregar a favoritos',
							icon: 'error',
						});
						navigate('/login');
					}
				} else {
					Toast.fire({
						title: 'Agregado a Favoritos',
						icon: 'success',
					});
				}
			});
		} else {
			Toast.fire({
				title: 'Eliminado de Favoritos',
				icon: 'warning',
			});
			deleteEventToFavorite(id.eventId);
		}
		refetch();
	};

	const handleDelete = async (id: any) => {
		Swal.fire({
			title: 'Esta seguro de eliminar el Evento?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: 'orange',
			cancelButtonColor: '#d33',
			cancelButtonText: 'Cancelar',
			confirmButtonText: 'Eliminar',
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					title: 'Evento Eliminado!',
					icon: 'success',
				});
				deleteEvent(id).then(() => navigate('/'));
			}
		});
	};

	const mapLocation = eventDetail.locations?.map((loc: any) => loc);
	const locationResult = mapLocation?.filter(
		(loc: Location) => loc.id == location,
	);

	return (
		<React.Fragment>
			{/* <nav>
				<NavBar />
			</nav> */}

			<div className={event_style.container}>
				<div className={event_style.div1}>
					<div className={event_style.h1}>
						<h1>Evento: {eventDetail.name}</h1>
					</div>
					<div className={event_style.divDeImg}>
						<img
							className={event_style.img}
							// style={{width:'550px', height: '250px'}}
							src={eventDetail.background_image}
							alt={eventDetail.name}
						/>
					</div>
					<div className={event_style.divpandsmall}>
						<p className={event_style.p}>Descripción del evento:</p>
						<small className={event_style.small}>
							{eventDetail.description}
						</small>
					</div>

					<div>
						<Comments />
					</div>
				</div>
				<div className={event_style.div2}>
					{currentUser?.rolesId?.includes(3030) && (
						<div className={event_style.button_delete}>
							<button
								className={event_style.button_delete_style}
								onClick={handleDelete}
							>
								Eliminar Evento
							</button>
							<button
								className={event_style.button_delete_style}
								onClick={() => navigate(`/update-event/${id}`)}
							>
								Actualizar Evento
							</button>
						</div>
					)}

					{eventDetail &&
						locationResult?.map((loc: Location) => {
							return (
								<div className={event_style.location} key={loc.id}>
									<React.Fragment>
										<h4> 🏰 {loc.name}</h4>
										<small className={event_style.small1}>
											📍{loc.address},
										</small>
										<small className={event_style.small1}>
											{' '}
											{loc.city.name}.
										</small>
									</React.Fragment>
								</div>
							);
						})}

					<div className={event_style.divDeBotones}>
						<button className={event_style.button1} onClick={openModal}>
							Ver todas las fechas y precios
						</button>
						<EventModal isOpen={isOpenModal} closeModal={closeModal}>
							<h3>TODAS LAS FECHAS Y PRECIOS</h3>
							<p>{eventDetail.name}</p>
							{locationResult?.map((location: Location) => {
								return (
									<React.Fragment key={location.id}>
										{location?.dates.map((date: Dates) => {
											return (
												<React.Fragment key={date.id}>
													<h5>Precio: ${date.price}</h5>
													<h5>Fecha: {date.date as any}</h5>
												</React.Fragment>
											);
										})}
									</React.Fragment>
								);
							})}
						</EventModal>

						<button
							className={event_style.button2}
							onClick={() => {
								addFavorites({ eventId: id });
							}}
						>
							{isFavorites.length === 0
								? 'Agregar a favoritos '
								: 'Favorito ❤️'}
						</button>
						<hr style={{ width: '350px' }} />
						<div>
							{locationResult?.map((location: Location) => {
								return (
									<React.Fragment key={location.id}>
										{location?.dates.map((date: Dates) => {
											return (
												<div
													className={event_style.containerCart}
													key={date.id}
												>
													<p className={event_style.p}>
														{`Dia: ${date.date}  Precio: $${date.price},00`}
													</p>
													<button
														className={event_style.iconCartContainer}
														title="Agregar al carrito."
													>
														<BsCartPlus
															className={event_style.iconCart}
															onClick={() =>
																dispatch(
																	addToCart({
																		dateId: date.id,
																		price: date.price,
																		date: date.date,
																		eventId: eventDetail.id,
																		locationId: location.id,
																		locationName: location.name,
																		eventName: eventDetail.name,
																		eventImg: eventDetail.background_image,
																	}),
																)
															}
														/>
														Agregar Al Carrito
													</button>
												</div>
											);
										})}
									</React.Fragment>
								);
							})}
						</div>
						<Link to="/checkout">
							<button className={event_style.button2}>Ir al carrito.</button>
						</Link>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};
export default Event;
