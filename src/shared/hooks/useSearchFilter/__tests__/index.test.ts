import {renderHook} from '@testing-library/react';
import useSearchFilter from '../index';
type Props = {
  id: number;
  name: string;
  age: number;
  test?: {
    first: string;
  };
};

describe('useSearchFilter', () => {
  const data: Props[] = [
    {id: 1, name: 'John Doe', age: 25},
    {id: 2, name: 'Jane Smith', age: 30},
    {id: 3, name: 'Bob Johnson', age: 35},
  ];

  it('should return the original data when search value is empty', () => {
    const {result} = renderHook(() =>
      useSearchFilter(data, '', ['name'], undefined, 0),
    );

    expect(result.current[0]).toEqual(data);
    expect(result.current[1]).toBe(data.length);
  });

  it('should filter data based on search value and search filter keys', () => {
    const {result} = renderHook(() =>
      useSearchFilter(data, 'John', ['name'], undefined, 0),
    );

    expect(result.current[0]).toEqual([
      {id: 1, name: 'John Doe', age: 25},
      {id: 3, name: 'Bob Johnson', age: 35},
    ]);
    expect(result.current[1]).toBe(2);
  });

  it('should filter data based on custom search filters', () => {
    const customSearchFilter = (item: Props) => item.test?.first;

    const dataCustom: Props[] = [
      {
        id: 1,
        name: 'John Doe',
        age: 25,
        test: {
          first: 'test 1',
        },
      },
      {id: 2, name: 'Jane Smith', age: 30},
      {id: 3, name: 'Bob Johnson', age: 35},
    ];

    const {result} = renderHook(() =>
      useSearchFilter(dataCustom, 'test 1', undefined, [customSearchFilter], 0),
    );

    expect(result.current[0]).toEqual([
      {
        id: 1,
        name: 'John Doe',
        age: 25,
        test: {
          first: 'test 1',
        },
      },
    ]);
    expect(result.current[1]).toBe(1);
  });

  it('should return the original data when search value length is less than search filter min length', () => {
    const {result} = renderHook(() =>
      useSearchFilter(data, 'Jo', ['name'], undefined, 3),
    );

    expect(result.current[0]).toEqual(data);
    expect(result.current[1]).toBe(data.length);
  });
});
