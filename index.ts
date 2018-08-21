/**
 * Obtém descritores para uma propriedade imutável.
 * @param value - O valor da propriedade.
 * @param isEnumerable - Tornar a propriedade enumerável?
 */
const getImmutableDescriptor = <T> (value: T, isEnumerable: boolean = false): TypedPropertyDescriptor<T> => ({
	value,
	writable: false,
	enumerable: isEnumerable,
	configurable: false
});

/**
 * Tipificação para coleções imutáveis.
 */
export type ImmutableCollection <T> = {
	readonly [index: number]: T;

	/**
	 * Quantidade de items na coleção.
	 */
	readonly length: number;

	/**
	 * Iterador da coleção.
	 */
	readonly [Symbol.iterator]: Function;
};

/**
 * Cria uma coleção de items imutáveis.
 * @param items - Items da coleção.
 */
export const createImmutableCollection = <T> (items: ArrayLike<T>): ImmutableCollection<T> => {
	const length = items.length;
	const descriptors = {
		'length': getImmutableDescriptor(length)
	};

	descriptors[Symbol.iterator] = getImmutableDescriptor(
		function * () {
			for (let index = 0; index < this.length; index++)
				yield this[index];
		}
	);

	if (length > 0) {
		let index = length;

		while (index--)
			descriptors[index] = getImmutableDescriptor(items[index], true);
	}

	return Object.freeze(Object.create(null, descriptors)) as ImmutableCollection<T>;
};

/**
 * Função anônima de mapeamento.
 */
export type MapΛ <T, U> = (item: T, index: number) => U;

/**
 * Mapeia uma coleção para uma coleção imutável.
 */
export const map = <T, U> (
	items: ArrayLike<T>, λ: MapΛ<T, U>
): ImmutableCollection<U> => createImmutableCollection(Array.from(items, λ));
