import React, { useState, useEffect, Children, FormEvent } from "react";
import {
  CButton,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CCol,
  CFormTextarea,
  CTooltip,
} from "@coreui/react";
import Category from "src/services/CategoryService";
import SelectSearch from "react-select-search";
import CIcon from "@coreui/icons-react";
import { cilPlus } from "@coreui/icons";
import SearchDropdown from "../../../components/SearchDropdown";
import { getParentCategoriesHandler, getChildCategoriesHandler } from "src/store/category";
import { connect, useSelector } from "react-redux";
import { RootState } from "src/store";
import { ParentCategoriesType, ChildAndGrandCategoriesType } from "src/types";

type PropTypes = {
  action : (d:any) => void
  type : 'child' | 'grand' | 'parent'
}

const AddCategoryModal = ({ action, type   }:PropTypes) => {
  const { parentCategories: { data: parentCategories }, childCategories: { data: childCategories }, grandChildCategories: { data: grandChildCategories } } = useSelector((state: RootState) => state.category)
  const [visible, setVisible] = useState(false);
  const [parentData, setParentData] = useState<ParentCategoriesType[]>([]);
  const [parentId, setParentId] = useState<string>("");
  const [childData, setChildData] = useState<ChildAndGrandCategoriesType[]>([]);
  const [childId, setChildId] = useState<string>("");
    const [loading, setLoading] = useState(false);
  const [resetChild, setResetChild] = useState<boolean>(false)
  const callParentData = async () => {
    const { data: { data } } = await Category.getAllParentCategoires()
    return data
  }
  const callChildData = async (id : string) => {
    const { data: { data } } = await Category.getAllChildCategoires({ parent_id: id })
    setParentId(id)
    setChildData(data)
    setResetChild(true)
  }
  useEffect(() => {
    callParentData().then(data => setParentData(data))
  }, []);
 
  const onChange = (e: string) => {
    setChildData(childCategories.filter((x: ChildAndGrandCategoriesType) => x.entitle.toLowerCase().includes(e.toLowerCase()) || x.artitle.toLowerCase().includes(e.toLowerCase())))
  }


  const onChangeParent = (e: string) => {
    setParentData(parentCategories.filter((x: ParentCategoriesType ) => x.entitle.toLocaleLowerCase().includes(e.toLocaleLowerCase()) || x.artitle.toLocaleLowerCase().includes(e.toLocaleLowerCase())))
    setResetChild(true)
  }
  const submitHandler = (e : FormEvent <HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      entitle : {value:string}
      artitle :{value:string} 
      metatitle: {value:string}
      content: {value:string}
    }
    action(
      {
        entitle: target.entitle.value,
        artitle: target.artitle.value,
        metatitle: target.metatitle.value,
        content: target.content.value,
        parent_id: type === "child" ? parentId : childId,
      }
    );
    setVisible(false);
  };
  return (
    <React.Fragment>
      <CButton color="primary" onClick={() => setVisible(true)}>
        <CIcon icon={cilPlus} size="lg" />
        Add Category
      </CButton>

      <CModal
        alignment="center"
        visible={visible}
        onClose={() => setVisible(false)}
       
        backdrop="static"
      >
        <CModalHeader>
          <CModalTitle>Add Category</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={submitHandler}>
          <CRow className="justify-content-center" xs={{ gutter: 2 }}>
            <CCol xs="auto">
              <CFormInput placeholder="english title" id="entitle" required />
            </CCol>
            <CCol xs="auto">
              <CFormInput placeholder="arabic title" id="artitle" required />
            </CCol>
            {(type === "child" || type === "grand") && (
              <CCol xs='auto'>
                <SearchDropdown options={parentData.map((val: ParentCategoriesType) => {
                  return {
                    title: `${val.entitle} - ${val.artitle}`,
                    id: val.id,
                  };
                })}

                onChange={onChangeParent}
                placeholder="select parent category"
                onSelect={e => callChildData(e.id)} 
                loading={loading} />
              </CCol>
            )}
            {type === 'child' && <CCol xs={5}><CFormInput type="number" placeholder="commission" max='.99' min='.01' step='.01' required /></CCol>}
            {type === "grand" && (
              <CCol xs='auto'>
                <SearchDropdown options={childData.map((val : ChildAndGrandCategoriesType) => {
                  return {
                    title: `${val.entitle} - ${val.artitle}`,
                    id: val.id,
                  };
                })}
                  reset={resetChild}
                  resetCallback={setResetChild}
                  onChange={onChange}
                  placeholder="select child category"
                  onSelect={(e: ChildAndGrandCategoriesType) => setChildId(e.id)}
                  loading={loading}
                />
              </CCol>
            )}
            <CCol xs={10}>
              <CFormInput placeholder="meta title" id="metatitle" />
            </CCol>
            <CCol xs={10}>
              <CFormTextarea placeholder="content" id="content" />
            </CCol>
          </CRow>
          <CModalFooter>
            <CButton type="submit">Submit</CButton>
            <CButton color="danger" onClick={() => setVisible(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </React.Fragment>
  );
};



export default connect(null, { getParentCategoriesHandler, getChildCategoriesHandler })(AddCategoryModal);
