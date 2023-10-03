import { useEffect, useState } from "react";
import axios from "axios";

export function Modal({ edit, fetch, close, datas }) {
  const [status, setStatus] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    id_produk: 0,
    nama_produk: "",
    harga: 0,
    kategori_id: 0,
    status_id: 0,
  });

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const getProduct = async () => {
    setLoading(true);
    try {
      setInput(datas);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(process.env.API_URI + "/categories");

      setKategori(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getStatus = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(process.env.API_URI + "/status");

      setStatus(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      axios.post(process.env.API_URI + "/product", input).then(() => {
        setLoading(false);
        close();
        fetch();
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      axios.patch(process.env.API_URI + "/product", input).then(() => {
        setLoading(false);
        close();
        fetch();
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!edit) {
      getCategories();
      getStatus();
    } else {
      getProduct();
      getCategories();
      getStatus();
    }
  }, [edit]);

  return (
    <>
      <div
        className="absolute z-10 bg-black opacity-50 w-full h-screen top-0 left-0"
        onClick={close}
      ></div>

      <div className="absolute z-20 min-w-[40%] min-h-[300px] px-6 py-5 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg flex flex-col gap-3">
        <h1 className="text-center text-3xl mb-4">
          Form {edit ? "Edit" : "Tambah"} Data
        </h1>

        <div className="w-full flex flex-col gap-1">
          <label className="text-lg">Nama Produk</label>
          <input
            name="nama_produk"
            type="text"
            required
            className="border-b border-black focus:border-emerald-400 focus:outline-none"
            onChange={handleChange}
            value={input.nama_produk}
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <label className="text-lg">Harga</label>
          <input
            name="harga"
            type="number"
            required
            className="border-b border-black focus:border-emerald-400 focus:outline-none"
            onChange={handleChange}
            value={input.harga}
          />
        </div>

        <div className="w-full flex flex-col gap-1">
          <label className="text-lg">Kategori</label>
          <select
            name="kategori_id"
            onChange={handleChange}
            value={input.kategori_id}
            required
            className="border-b border-black focus:border-emerald-400 focus:outline-none"
          >
            <option value="">Pilih Kategori</option>
            {kategori?.map((item, index) => (
              <option key={index} value={item.id_kategori}>
                {item.nama_kategori}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full flex flex-col gap-1">
          <label className="text-lg">Status</label>
          <select
            name="status_id"
            onChange={handleChange}
            value={input.status_id}
            required
            className="border-b border-black focus:border-emerald-400 focus:outline-none"
          >
            <option value="">Pilih Status</option>
            {status?.map((item, index) => (
              <option key={index} value={item.id_status}>
                {item.nama_status}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full flex items-center justify-end gap-2">
          <button
            disabled={loading}
            className="bg-red-600 hover:bg-red-400 px-3 py-2 text-white rounded-lg w-[100px]"
            onClick={() => {
              setInput({
                nama_produk: "",
                harga: 0,
                kategori_id: 0,
                status_id: 0,
              });

              close();
            }}
          >
            BATAL
          </button>
          <button
            disabled={
              loading ||
              input.nama_produk === "" ||
              input.harga < 1 ||
              input.kategori_id < 1 ||
              input.status_id < 1
            }
            className="bg-blue-600 hover:bg-blue-400 px-3 py-2 text-white rounded-lg min-w-[100px] flex items-center justify-center"
            onClick={edit ? handleUpdate : handleSubmit}
          >
            {loading && (
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            SIMPAN
          </button>
        </div>
      </div>
    </>
  );
}

export function DeleteModal({ id, name, close, fetch }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      axios
        .delete(process.env.API_URI + "/product", { data: { id_produk: id } })
        .then(() => {
          setLoading(false);
          close();
          fetch();
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="absolute z-10 bg-black opacity-50 w-full h-screen top-0 left-0"
        onClick={close}
      ></div>

      <div className="absolute z-20 min-w-[30%] min-h-[50px] px-6 py-5 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg flex flex-col gap-3">
        <h1 className="text-center mb-4 text-xl">
          Apakah Anda yakin ingin menghapus {name}
        </h1>

        <div className="w-full flex items-center justify-center gap-2">
          <button
            disabled={loading}
            className="bg-red-600 hover:bg-red-400 px-3 py-2 text-white rounded-lg w-[100px]"
            onClick={close}
          >
            BATAL
          </button>
          <button
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-400 px-3 py-2 text-white rounded-lg min-w-[100px] flex items-center justify-center"
            onClick={handleSubmit}
          >
            {loading && (
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            SIMPAN
          </button>
        </div>
      </div>
    </>
  );
}
