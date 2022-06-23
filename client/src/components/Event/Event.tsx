import React, { useContext, useEffect, useState } from 'react';
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
import { EventCartContext } from '../EventCart/EventCartContext';
import { Link } from 'react-router-dom';
import {
	useDeleteEventMutation,
	useAddEventToFavoriteMutation,
} from '../../slices/app/eventsApiSlice';
import Swal from 'sweetalert2';

import {
	useDeleteEventToFavoriteMutation,
	useGetFavoriteQuery,
} from '../../slices/app/usersApiSlice';


const Event = () => {
	const Toast = Swal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', Swal.stopTimer);
			toast.addEventListener('mouseleave', Swal.resumeTimer);
		},
	});
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
	const { addTicketToCart } = useContext(EventCartContext);
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
						<Comments/>
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
												<div key={date.id}>
													<p>
														{`Dia: ${date.date} // Precio: $${date.price},00`}
													</p>
													<button title="Agregar al carrito.">
														<BsCartPlus onClick={() => addTicketToCart(date)} />
													</button>
												</div>
											);
										})}
									</React.Fragment>
								);
							})}
						</div>
						<Link to="/cart">
							<button className={event_style.button2}>Ir al carrito.</button>
						</Link>
					</div>





				</div>

			</div>
		</React.Fragment>
	);
};
export default Event;
