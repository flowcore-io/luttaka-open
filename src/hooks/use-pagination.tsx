import {useCallback, useMemo, useState} from "react";
import {useSearchParams} from "next/navigation";

export type PageControls = {
  page: number;
  setPage: (page: number) => void;
  next: () => void;
  previous: () => void;
}

export const usePagination = (): PageControls => {

  const searchParams = useSearchParams();

  const startPage = useMemo(() => {
    const param = searchParams.get("page")
    const parsedPage = param ? parseInt(param) : 1;

    return Math.max(parsedPage, 1);
  }, []);

  const [page, setPageInternally] = useState(startPage);

  const setPage = useCallback((value: number) => {
    const safeValue = Math.max(value, 1);
    setPageInternally(safeValue);
  }, [page]);

  const next = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  const previous = useCallback(() => {
    setPage(page - 1);
  }, [page]);

  return {
    page, setPage, next, previous
  }
}
