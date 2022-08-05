import './Home.scss';
import { Botao } from '../../components/Botao';
import { PokemonApi } from '../../services/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { cartOpen, addToCart } from '../../store';

const Pokemon = (props) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const name = props.name; 
    const id = props.url.replace('https://pokeapi.co/api/v2/pokemon/', '').replace('/', '');
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    const price = Math.floor(name.length / 2 * 100);

   
    const buyPokemon = (e) => {
        e.stopPropagation();
        dispatch(addToCart({
            id, 
            name,
            image,
            price: price * 0.8,
        }));

        dispatch(cartOpen());       
    }

    return (
        <section onClick={() => navigate(`/pokemon/${name}`)} className='dados-pokemons'>
            <img src={image} alt={name} />
            <h3 className='poke-name'>{name}</h3>
            <p className='price-from'>R$ {price},00</p>
            <p className='price-to'>R$ {price * 0.8},00</p>
            <Botao 
                className='poke-buy' 
                texto='Comprar' 
                onClick={buyPokemon}
            />
        </section>
    )
}

export function Home() {
    const limit = 20;
    let total;

    const [state, setState] = useState({
        loading: true,
        pokemons: [],
        currentPage: 0,
        total: 0,
        totalPages: 0,
    });

    useEffect(() => {
        PokemonApi.listPokemons(state.currentPage * limit, limit)
        .then(({ data }) => {
            setState((prev) => ({
                ...prev,
                total: data.count,
                totalPages: Math.ceil(total / limit),
                pokemons: [...prev.pokemons, ...data.results.map((pokemon, key) => <Pokemon key={key + (prev.pokemons.length + 1)} name={pokemon.name} url={pokemon.url} />)] 
            }));
        });
    }, [state.currentPage, total]);
    
    const loadMore = () => {

        let page = state.currentPage;

        if ((page + 1) >= state.totalPages) return;

        page += 1;

        setState((prev) => ({
            ...prev,
            currentPage: page
        }));
    }

    return (
        <main className='main'>
            <div className='poke-list'>
                {state.pokemons}
            </div>
            <div className='button-load'>
                <Botao texto='Carregar mais' onClick={loadMore}/>
            </div>
        </main>
    )
}