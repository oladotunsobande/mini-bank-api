import rs from 'randomstring';
import CustomerRepository from '../repositories/CustomerRepository';

export async function getCustomerId(): Promise<number> {
  const randomValue = Math.floor((Math.random() * 10) + 1);

  const id: string = rs.generate({
    charset: 'numeric',
    length: randomValue,
  });

  const customer = await CustomerRepository.getOneBy({ id: parseInt(id) });
  if (customer) await getCustomerId();

  return parseInt(id);
}