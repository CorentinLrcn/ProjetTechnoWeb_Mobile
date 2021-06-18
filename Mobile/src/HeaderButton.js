import React from "react"
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const HeaderButton = (navigation) => {
    return (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 15 }}>
            <AntDesign name="arrowleft" size={25} color='white' />
        </TouchableOpacity>
    )
}

export default HeaderButton