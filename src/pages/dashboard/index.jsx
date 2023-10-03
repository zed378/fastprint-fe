import { useState, useEffect } from "react";
import { TablePagination } from "../../components/organism/table";
import axios from "axios";
import convertRupiah from "rupiah-format";

import { DeleteModal, Modal } from "@/components/organism/modal";

export default function Dashboard() {
  const [produk, setProduk] = useState([]);
  const [status, setStatus] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState("1");

  const [create, setCreate] = useState(false);
  const [update, setUpdate] = useState(false);

  const column = [
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Nama</p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {row.nama_produk}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Harga</p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {convertRupiah.convert(row.harga)}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">
          Kategori
        </p>
      ),
      selector: (row) => (
        <div className="2xl:text-lg xl:text-xs font-normal text-black">
          {categoryFilter(row.kategori_id)}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Status</p>
      ),
      selector: (row) => (
        <div
          className={`2xl:text-lg xl:text-xs font-normal ${
            row.status_id === 1 ? "text-black" : "text-red-600"
          }`}
        >
          {row.status_id === 1 ? "Bisa dijual" : "Tidak bisa dijual"}
        </div>
      ),
    },
    {
      name: (
        <p className="2xl:text-lg xl:text-sm font-medium text-black">Aksi</p>
      ),
      selector: (row) => (
        <div
          className="2xl:text-lg xl:text-xs font-normal"
          onChange={(e) => {
            if (e.target.value === "hapus") {
              setDelModal(
                <DeleteModal
                  id={row.id_produk}
                  name={row.nama_produk}
                  fetch={getProducts}
                  close={() => setDelModal(null)}
                />
              );
            } else if (e.target.value === "edit") {
              setUpdate(true);
              setDelModal(
                <Modal
                  datas={row}
                  edit={update}
                  fetch={getProducts}
                  close={() => setDelModal(null)}
                />
              );
            }
          }}
        >
          <select className="text-black border border-black rounded-lg px-2 cursor-pointer">
            <option value="">Aksi</option>
            <option value="edit">Edit</option>
            <option value="hapus">Hapus</option>
          </select>
        </div>
      ),
    },
  ];

  const getProducts = async (val) => {
    setLoading(true);
    try {
      if (val == "1") {
        const { data } = await axios.get(
          process.env.API_URI + "/products?isTradable=1"
        );

        setProduk(data.data);
        setLoading(false);
      } else if (val == "2") {
        const { data } = await axios.get(
          process.env.API_URI + "/products?isTradable=2"
        );

        setProduk(data.data);
        setLoading(false);
      } else {
        const { data } = await axios.get(process.env.API_URI + "/products");

        setProduk(data.data);
        setLoading(false);
      }
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

  const [delModal, setDelModal] = useState(null);

  const categoryFilter = (val) => {
    const data = kategori.filter((el) => {
      return el.id_kategori === val && el.nama_kategori;
    });

    return data[0]?.nama_kategori;
  };

  useEffect(() => {
    getProducts();
    getCategories(1);
  }, []);

  useEffect(() => {
    params == "1" && getProducts(1);
    params == "2" && getProducts(2);
    params == "Netral" && getProducts("netral");
  }, [params]);

  return (
    <div className="w-full h-screen px-20 absolute">
      {create && (
        <Modal
          edit={update}
          fetch={getProducts}
          close={() => setCreate(false)}
        />
      )}

      {delModal && delModal}

      <div className="flex items-center justify-between 2xl:mt-8">
        <h1
          className="font-semibold text-4xl py-3 m-0"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Data Produk
        </h1>
        <div className="flex items-center gap-3">
          <select
            className="bg-[#ffffff00] border-b border-slate-500"
            onChange={(e) => setParams(e.target.value)}
            defaultValue="Netral"
          >
            <option value="Netral">Filter Status</option>
            <option value="Netral">Semua</option>
            <option value="1">Bisa Dijual</option>
            <option value="2">Tidak Bisa Dijual</option>
          </select>

          <button
            className="rounded-lg px-8 py-2 text-sm text-white bg-[#00672E] hover:opacity-60"
            onClick={() => {
              setCreate(true);
              setUpdate(false);
            }}
          >
            Tambah Data
          </button>
        </div>
      </div>
      <TablePagination items={produk} column={column} ItemsPerPage={10} />
    </div>
  );
}
